<script lang="ts">
    import { onMount } from "svelte";
    let categories: { categoryName: string; visible: boolean }[] = [];
    let products: any[] = [];
    let productStock: any[] = [];

    const API_URL = "http://localhost:3000/getInventory";
    const WRITE_URL = "http://localhost:3000/write"
    const DELETE_URL = "http://localhost:3000/delete"

    async function fetchData() {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
        const data = await response.json();
        productStock = data;
        getCategories();
    }

    async function writeData() {
        const response = await fetch(WRITE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
        const data = await response.json();
        //console.log(data);
    }

    function getCategories() {
        for (const productId in productStock) {
            if (Object.hasOwnProperty.call(productStock, productId)) {
                const categoryName = productStock[productId];
                products.push(productId + "+" + categoryName);

                if (!categories.includes(categoryName)) {
                    categories.push({
                        categoryName: categoryName,
                        visible: false,
                    });
                }
            }
        }
    }

    function toggleVisibility(categoryName: string): void {
        categories = categories.map((category) => {
            if (category.categoryName === categoryName) {
                return { ...category, visible: !category.visible };
            }
            return category;
        });        
    }

    onMount(async () => {
        const response = await fetch(WRITE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
        const data = await response.json();
    });
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
        <div class="col"><i class="fa-solid fa-boxes-stacked"></i></div>
        <div class="col">b</div>
        <div class="col">c</div>
    </div>

    <div class="col mt-3" style="color: var(--color-primary-600);">
        {#await fetchData() then}
            {#each categories as category}
                <div class="mb-3">
                    <div
                        class="row p-2 mx-5 rounded-top-3 text-center d-flex align-items-center categoryListing"
                        style="background-color: var(--color-primary-500); color: var(--color-surface-mixed-200); font-weight: bold"
                    >
                        <div class="col">{category.categoryName.substring(0,category.categoryName.indexOf("+"))}</div>
                        <div class="col">Stock: {category.categoryName.substring(category.categoryName.indexOf("+")+1,category.categoryName.length)}</div>
                        <div class="col d-flex justify-content-end">
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="row">
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div
                                    class="col rounded-3 dropdownButton"
                                    on:click={() =>
                                        toggleVisibility(category.categoryName)}
                                >
                                    <i class="fa-solid fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {#if category.visible}
                        
                        <div class="products">
                            {#each products as product}
                                {#if product.includes(category.categoryName)}
                                    <div
                                        class="row p-2 mx-5 text-center d-flex align-items-center productListing"
                                        style="background-color: var(--color-surface-mixed-200)"
                                    >
                                        <div class="col">
                                            {product.substring(0, 8)}
                                        </div>
                                        <div
                                            class="col d-flex justify-content-end"
                                        >
                                            <div class="row">
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                                <div
                                                    class="col me-1 rounded-3 productButton"
                                                >
                                                    <i
                                                        class="fa-solid fa-magnifying-glass"
                                                    ></i>
                                                </div>
                                                <div
                                                    class="col ms-1 rounded-3 productButton"
                                                >
                                                    <i
                                                        class="fa-solid fa-pencil"
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        {/await}
    </div>
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
