<script lang="ts">
    import { goto } from "$app/navigation";

    const STOCK_URL: string = "/warehousemanager/stock";
    const ADD_URL: string = "/warehousemanager/add";
    const NFC_URL: string = "/warehousemanager/readNFC";
</script>

<svelte:head>
    <title>Warehouse Manager</title>
    <meta name="description" content="Svelte demo app" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    />
</svelte:head>

<div class="container pt-5">
    <div class="row justify-content-center align-items-center">
        <div class="col text-center">
            <h1>Warehouse Manager</h1>
        </div>
    </div>
    <div class="row justify-content-center align-items-center pt-5">
        <div class="col text-center">
            <button
                type="button"
                class="btn btn-dark btn-rounded ms"
                on:click={() => goto(STOCK_URL)}>Stock</button
            >
            <button
                type="button"
                class="btn btn-dark btn-rounded ms-3"
                on:click={() => goto(ADD_URL)}>Add new product</button
            >
            <button
                type="button"
                class="btn btn-dark btn-rounded ms-3"
                on:click={() => goto(NFC_URL)}>Read NFC Tag</button
            >
        </div>
    </div>
</div>
