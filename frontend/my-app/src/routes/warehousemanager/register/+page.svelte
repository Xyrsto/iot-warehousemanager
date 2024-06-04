<script lang="ts">
    import { goto } from "$app/navigation";

    const urlAPI = localStorage.getItem("URL_API");
    const API_URL = urlAPI + "/register";

    let username: string = "";
    let email: string = "";
    let password: string = "";
    let role: boolean = false;

    async function registerUser(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                    role: role,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            goto("/");
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }
</script>

<svelte:head>
    <title>Register User</title>
    <meta name="description" content="Register a new user" />
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
            <h1>Register User</h1>
        </div>
    </div>

    <div class="container d-flex justify-content-center align-items-center" style="height:calc(100vh - 100px); background-color: var(--color-surface-mixed-100)">
        <form on:submit|preventDefault={registerUser} class="text-center">
            <input type="text" placeholder="Username" bind:value={username} class="mb-2 form-control" required/>
            <input type="email" placeholder="Email" bind:value={email} class="mb-2 form-control" required/>
            <input type="password" placeholder="Password" bind:value={password} class="mb-2 form-control" required/>
            <div class="mb-3">
                <input type="checkbox" id="isAdmin" bind:checked={role} />
                <label for="isAdmin" style="color:white;">Escritório?</label>
            </div>

            <div class="flex">
                <button type="button" class="btn btn-dark btn-rounded flex flex-col" style="background-color: var(--color-primary-200); color: white;" on:click={() => goto('/')}>Back to Home</button>

                <button type="submit" class="btn btn-dark btn-rounded flex flex-col" style="background-color: var(--color-primary-300); color: white">Register</button>
            </div>
            
        </form>
    </div>
</div>

<style>
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

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 400px;
        padding: 20px;
        background-color: var(--color-surface-mixed-200);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .form-control {
        padding: 10px;
        border: 1px solid var(--color-primary-100);
        border-radius: 5px;
    }

    .form-control:focus {
        border-color: var(--color-primary-100);
        box-shadow: none;
    }

    label {
        color: var(--color-primary-100);
    }
</style>
