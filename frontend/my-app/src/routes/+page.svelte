<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { jwtDecode } from "jwt-decode";
    import { json } from "@sveltejs/kit";

    const STOCK_URL: string = "/warehousemanager/stock";
    const REGISTER_URL: string = "/warehousemanager/register";
    const ADD_CATEGORY_URL: string = "/warehouseManager/addCategory";
    const DELETE_URL = "http://localhost:3000/delete";
    const NFC_URL: string = "/warehousemanager/readNFC";

    const LOGIN_URL = "http://localhost:3000/login";
    const ROLE_URL = "http://localhost:3000/getUserRole";

    let email: string = "";
    let password: string = "";
    let userRole: boolean;

    let jwtToken: string | null = null;

    async function loginUser(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("jwtToken", data.token);
            }

            jwtToken = localStorage.getItem("jwtToken");
            location.reload();
        } catch (error) {
            console.error("Error user login:", error);
        }
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

<div class="overflow-hidden" style="height:100vh; width: 100vw">
    <div class="row justify-content-center align-items-center">
        <div class="col text-center py-3" style="color: #b391cc; background-color: #2e2832 !important;">
            <h1>Warehouse Manager</h1>
        </div>
    </div>

    {#if jwtToken}
        <div class="row justify-content-center align-items-center pt-5">
            <div class="col text-center">
                <button
                    type="button"
                    class="btn btn-dark btn-rounded ms"
                    style="background-color: var(--color-primary-300)"
                    on:click={() => goto(STOCK_URL + "?page=0")}
                    >Ver Stock</button
                >
                {#if userRole == false}
                    <button
                        type="button"
                        class="btn btn-dark btn-rounded ms-3"
                        style="background-color: var(--color-primary-300)"
                        on:click={() => goto(STOCK_URL + "?page=1")}
                        >Adicionar Produto</button
                    >

                    <button
                        type="button"
                        class="btn btn-dark btn-rounded ms-3"
                        style="background-color: var(--color-primary-300)"
                        on:click={() => {
                            goto(DELETE_URL);
                            window.alert("Continue no dispositivo.");
                            setTimeout(() => {
                                goto(STOCK_URL + "?page=0")
                            }, 1000);
                        }}>Remover Produto</button
                    >
                {/if}
                {#if userRole}
                    <button
                        type="button"
                        class="btn btn-dark btn-rounded ms-3"
                        style="background-color: var(--color-primary-300)"
                        on:click={() => goto(REGISTER_URL)}
                        >Registar Utilizador</button
                    >
                {/if}

                <button
                    type="button"
                    class="btn btn-dark btn-rounded ms-3"
                    style="background-color: var(--color-primary-300)"
                    on:click={() => {
                        localStorage.removeItem("jwtToken");
                        location.reload();
                    }}>Logout</button
                >
            </div>
        </div>
    {:else}
        <div>
            <form
                class="d-flex justify-content-center"
                on:submit|preventDefault={loginUser}
            >
                <input type="email" placeholder="email" bind:value={email} />
                <br />
                <!-- Add line break to stack elements -->
                <input
                    type="password"
                    placeholder="password"
                    bind:value={password}
                />
                <br />
                <!-- Add line break to stack elements -->
                <button
                    type="submit"
                    style="padding: 5px 20px; border:none; border-radius: 10px; background-color: var(--color-primary-100); color: white"
                    >Login</button
                >
            </form>
        </div>
    {/if}
</div>

<style>
    form {
        display: flex;
        flex-direction: column; /* Stack elements vertically */
        align-items: center; /* Center align items horizontally */
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

        background-color: var(--color-surface-mixed-100) !important;
    }
</style>
