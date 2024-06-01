<script lang="ts">
    const API_URL = "http://localhost:3000/register";

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
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User registered:', data);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }
</script>

<div class="container d-flex justify-content-center align-items-center" style="height:100vh; background-color:white">
    <form on:submit|preventDefault={registerUser} style="text-align: center;">
        <input type="text" placeholder="username" bind:value={username} style="margin-bottom: 10px;" />
        <input type="email" placeholder="email" bind:value={email} style="margin-bottom: 10px;" />
        <input type="password" placeholder="password" bind:value={password} style="margin-bottom: 10px;" />
        <div><input type="checkbox" name="isAdmin" id="isAdmin" bind:checked={role}><label for="isAdmin">Escritório?</label></div>

        
        <button type="submit" style="padding: 5px 20px; border:none; border-radius: 10px; background-color:black; color: white">Register</button>
    </form>
</div>


<style>
    html, body{
        background-color: white !important;
        padding: 0px;
        margin: 0px;
    }

    .container {
    display: flex;
    justify-content: center;
    align-items: center;
}

form {
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    align-items: center; /* Center align items horizontally */
}
</style>
