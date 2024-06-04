<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { jwtDecode } from "jwt-decode";
    import { json } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    let categories: { categoryName: string; visible: boolean }[] = [];
    let createCategories: any[] = [];
    let products: any[] = [];
    let productStock: any[] = [];

    const API_URL = "http://localhost:3000/getInventory";
    const WRITE_URL = "http://localhost:3000/write";
    const DELETE_URL = "http://localhost:3000/delete";
    const CREATE_CATEGORY_URL = "http://localhost:3000/addCategory";

    const ROLE_URL = "http://localhost:3000/getUserRole";

    let jwtToken: string;
    let userRole: boolean;

    // Page Index
    let pageIndex = $page.url.searchParams.get("page");

    // Add product
    let selectedCategory: number | null = null;
    let productName: string = "";

    // Add category
    let categoryId: string = "";
    let categoryName: string = "";

    async function fetchData() {
        jwtToken = localStorage.getItem("jwtToken");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        productStock = data;
        getCategories();
    }

    async function fetchRole() {
        let userId = jwtDecode(jwtToken).userId;
        console.log(userId);

        const response = await fetch(ROLE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });

        const data = await response.json();
        userRole = data["user"].role;
        console.log(userRole);
    }

    onMount(async () => {
        jwtToken = localStorage.getItem("jwtToken");
        await fetchRole();
        await fetchCategories();
    });

    async function writeData() {
        const response = await fetch(WRITE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                productName: productName,
                categoryId: selectedCategory,
            }),
        });
        const data = await response.json();
        window.alert(data.message);
    }

    async function fetchCategories() {
        jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:3000/getCategories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        createCategories = data;
        createCategories[0].forEach((cat) => {
            cat.visible = false;
        });
        console.log(createCategories[0]);
    }

    function toggleVisibility(catName: string): void {
        console.log(catName);

        // Create a new array to trigger reactivity
        createCategories[0] = createCategories[0].map((category: any) => {
            if (category.categoryName === catName) {
                return { ...category, visible: !category.visible };
            }
            return category; // Ensure all categories are returned
        });
        createCategories = [...createCategories]; // Trigger reactivity
        console.log(createCategories[0]); // For debugging
    }

    async function fetchDelete() {
        jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch(DELETE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        window.alert("Continue no dispositivo.");
        setTimeout(() => {
            pageIndex = 0;
        }, 1000);
    }
</script>

<svelte:head>
    <title>Warehouse Manager</title>
    <meta name="description" content="Svelte demo app" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    />
</svelte:head>

<div class="main">
    <div class="navbar row text-center py-3">
        <div
            class="col"
            role="button"
            on:click={() => {
                goto("/");
            }}
        >
            <i class="fa-solid fa-house"></i>
        </div>

        <div
            class="col"
            role="button"
            on:click={() => {
                pageIndex = 0;
            }}
        >
            <i class="fa-solid fa-boxes-stacked"></i>
        </div>

        {#if userRole == false}
            <div
                class="col"
                role="button"
                title="Adicionar produto"
                on:click={() => {
                    pageIndex = 1;
                }}
            >
                <i class="fa-solid fa-square-plus"></i>
            </div>

            <div
                class="col"
                role="button"
                on:click={() => {
                    fetchDelete();
                }}
            >
                <i class="fa-solid fa-square-minus"></i>
            </div>
        {/if}
    </div>

    {#if pageIndex == 0}
        <div class="col mt-3" style="color: var(--color-primary-600);">
            {#if createCategories[0]}
                {#each createCategories[0] as category}
                    <div class="mb-3">
                        <div
                            class="row p-2 mx-5 rounded-top-3 text-center d-flex align-items-center categoryListing"
                            style="background-color: var(--color-primary-500); color: var(--color-surface-mixed-200); font-weight: bold"
                        >
                            <div class="col">
                                {category.categoryName}
                            </div>
                            <div class="col">
                                Stock: {category.categoryStock}
                            </div>
                            <div class="col d-flex justify-content-end">
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div class="row">
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div
                                        class="col rounded-3 dropdownButton"
                                        on:click={() =>
                                            toggleVisibility(
                                                category.categoryName,
                                            )}
                                    >
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {#if category.visible}
                            <div class="products">
                                {#each createCategories[1] as product}
                                    {#if product.categoryId == category.categoryId}
                                        <div
                                            class="row p-2 mx-5 text-center d-flex align-items-center productListing"
                                            style="background-color: var(--color-surface-mixed-200)"
                                        >
                                            <div
                                                class="col d-flex justify-content-center"
                                            >
                                                {product.productId}
                                            </div>

                                            <div
                                                class="col d-flex justify-content-center"
                                            >
                                                {product.productName}
                                            </div>

                                            <div class="col d-flex"></div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    {/if}

    {#if pageIndex == 1 && userRole == false}
        {#await fetchCategories() then}
            <div class="col mt-3" style="color: var(--color-primary-600);">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <form on:submit|preventDefault={writeData}>
                            <div class="mb-3">
                                <label for="productName" class="form-label"
                                    >Nome do produto</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="productName"
                                    bind:value={productName}
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <!--
                                <label for="category" class="form-label"
                                    >Categoria</label
                                >
                                
                                    <select
                                    id="category"
                                    class="form-select"
                                    bind:value={selectedCategory}
                                    required
                                >
                                    <option value="" disabled selected
                                        >Selecione uma categoria</option
                                    >
                                    {#each createCategories[0] as category}                                    
                                        <option value={category.categoryId}
                                            >{category.categoryName}</option
                                        >
                                        {console.log(category)}
                                    {/each}
                                </select>
                                -->
                            </div>
                            <div class="text-center">
                                <button
                                    type="submit"
                                    class="btn btn-dark btn-rounded"
                                    style="background-color: var(--color-primary-200)"
                                    >Adicionar</button
                                >
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        {/await}
    {/if}
</div>

<style>
    .row,
    .col {
        margin: 0;
    }
    :root {
        /** CSS DARK THEME PRIMARY COLORS */

        --color-primary-100: #4d008c;
        --color-primary-200: #632799;
        --color-primary-300: #7842a6;
        --color-primary-400: #8c5cb3;
        --color-primary-500: #a076c0;
        --color-primary-600: #b391cc;

        /** CSS DARK THEME SURFACE COLORS */

        --color-surface-100: #121212;
        --color-surface-200: #282828;
        --color-surface-300: #3f3f3f;
        --color-surface-400: #575757;
        --color-surface-500: #717171;
        --color-surface-600: #8b8b8b;

        /** CSS DARK THEME MIXED SURFACE COLORS */

        --color-surface-mixed-100: #19131d;
        --color-surface-mixed-200: #2e2832;
        --color-surface-mixed-300: #443f48;
        --color-surface-mixed-400: #5c5860;
        --color-surface-mixed-500: #757178;
        --color-surface-mixed-600: #8f8c92;

        background-color: var(--color-surface-mixed-100);
    }

    .main {
        background-color: var(--color-surface-mixed-100);
    }

    .navbar {
        background-color: var(--color-surface-mixed-200);
        color: var(--color-primary-500);
    }

    .dropdownButton {
        width: 40px;
        height: 40px;
        line-height: 40px;
    }

    .dropdownButton:hover {
        cursor: pointer;
        background-color: var(--color-surface-mixed-100);
        color: var(--color-surface-mixed-600);
    }

    .productButton {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: var(--color-primary-600);
        color: var(--color-surface-mixed-100);
    }

    .productButton:hover {
        cursor: pointer;
        background-color: var(--color-surface-mixed-100);
        color: var(--color-surface-mixed-600);
    }
</style>
