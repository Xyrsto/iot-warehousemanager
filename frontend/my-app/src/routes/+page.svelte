<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    const STOCK_URL: string = "/warehousemanager/stock";
    const REGISTER_URL: string = "/warehousemanager/register";
    const NFC_URL: string = "/warehousemanager/readNFC";

    const LOGIN_URL = "http://localhost:3000/login";

    let email: string = "";
    let password: string = "";

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
        } catch (error) {
            console.error("Error user login:", error);
        }
    }

    onMount(() => {
        jwtToken = localStorage.getItem("jwtToken");
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

<div class="container pt-5" style="height:100vh">
    <div class="row justify-content-center align-items-center">
        <div class="col text-center">
            <h1>Warehouse Manager</h1>
        </div>
    </div>

    {#if jwtToken}
        <div class="row justify-content-center align-items-center pt-5">
            <div class="col text-center">
                <button
                    type="button"
                    class="btn btn-dark btn-rounded ms"
                    on:click={() => goto(STOCK_URL+"?page=0")}>Ver Stock</button
                >
                <button
                    type="button"
                    class="btn btn-dark btn-rounded ms-3"
                    on:click={() => goto(STOCK_URL+"?page=1")}>Adicionar Produto</button
                >
                <button
                    type="button"
                    class="btn btn-dark btn-rounded ms-3"
                    on:click={() => goto(REGISTER_URL)}>Registar Utilizador</button
                >
                
            </div>
        </div>
    {:else}
    <div>
        <form class="d-flex justify-content-center" on:submit|preventDefault={loginUser}>
            <input type="email" placeholder="email" bind:value={email} />
            <br> <!-- Add line break to stack elements -->
            <input type="password" placeholder="password" bind:value={password} />
            <br> <!-- Add line break to stack elements -->
            <button type="submit" style="padding: 5px 20px; border:none; border-radius: 10px; background-color:black; color: white">Login</button>
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
</style>