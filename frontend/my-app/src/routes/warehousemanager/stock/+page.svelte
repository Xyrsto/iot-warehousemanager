<script lang="ts">
    import { onMount } from "svelte";
    import mqtt from "mqtt";
  
    let temp: string = "";
    let clientId = "client" + (Math.random() * 10000);
    let led = false;
  
    const url = "ws://192.168.1.237:9001";
    const options = {
      connectTimeout: 4000,
      clientId: clientId,
      username: "ruby2",
      password: "aluno23885",
    };
  
    const client = mqtt.connect(url, options);
  
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("test");
    });
  
    client.on("message", (topic, message) => {
      console.log("Message received on topic " + topic + ": " + message.toString());
      temp = message.toString(); // Update the value of the writable store
    });
  
    client.on("error", (error) => {
      console.error("MQTT error:", error);
    });
  
    function publishLed() {
      let msg;
      (led) ? msg = "on" : msg = "off";
      led = !led;
  
      client.publish("led", msg);
    }
  </script>

  
  <svelte:head>
    <title>Warehouse Manager</title>
    <meta name="description" content="Svelte demo app" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>

<div class="main">
    <div class="navbar row text-center py-3">
        <div class="col"><i class="fa-solid fa-boxes-stacked"></i></div>
        <div class="col">b</div>
        <div class="col">c</div>
    </div>
    <div class="row w-100 text-center  p-2 m-0" style="color: var(--color-primary-600)">
        <strong>Temperature:</strong> <span>{temp}</span>
    </div>

    <div class="col mt-2" style="color: var(--color-primary-600);">
        <div class="row p-2 mx-5 rounded-3 text-center d-flex align-items-center productListing largerScreen" style="background-color: var(--color-surface-mixed-200)">
            <div class="col">Nome Produto</div>
            <div class="col">Qtd.: 5</div>
            <div class="col d-flex justify-content-end ">
                <div class="row">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="col me-1 rounded-3 productButton" on:click={publishLed}><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="col ms-1 rounded-3 productButton"><i class="fa-solid fa-pencil"></i></div>
                </div>  
            </div>
        </div>

        <div class="row p-1 py-2 mx-5 rounded-3 text-center d-flex align-items-center productListing smallerScreen" style="background-color: var(--color-surface-mixed-200)">
            <div class="col">
                <div class="row mb-3">
                    <div class="col">Nome produto</div>
                    <div class="col">Qtd.: 5</div>
                </div>
                <div class="row">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="col me-1 rounded-3 productButton" on:click={publishLed}><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="col ms-1 rounded-3 productButton"><i class="fa-solid fa-pencil"></i></div>
                </div>
            </div>
        </div>
    </div>
</div>
  
  <style>
    .row, .col{
        margin: 0;
    }
    :root{   
        /** CSS DARK THEME PRIMARY COLORS */
        
        --color-primary-100:  #4d008c;
        --color-primary-200:  #632799;
        --color-primary-300:  #7842a6;
        --color-primary-400:  #8c5cb3;
        --color-primary-500:  #a076c0;
        --color-primary-600:  #b391cc;
        
        
        /** CSS DARK THEME SURFACE COLORS */
        
        --color-surface-100:  #121212;
        --color-surface-200:  #282828;
        --color-surface-300:  #3f3f3f;
        --color-surface-400:  #575757;
        --color-surface-500:  #717171;
        --color-surface-600:  #8b8b8b;
        
        
        /** CSS DARK THEME MIXED SURFACE COLORS */
        
        --color-surface-mixed-100:  #19131d;
        --color-surface-mixed-200:  #2e2832;
        --color-surface-mixed-300:  #443f48;
        --color-surface-mixed-400:  #5c5860;
        --color-surface-mixed-500:  #757178;
        --color-surface-mixed-600:  #8f8c92;

        background-color: var(--color-surface-mixed-100);
    }

    .main{
        background-color: var(--color-surface-mixed-100);
    }

    .navbar{
        background-color: var(--color-surface-mixed-200);
        color: var(--color-primary-500);
    }

    .productButton{
        width:40px; 
        height:40px; 
        line-height:40px; 
        background-color: var(--color-primary-600);
        color:var(--color-surface-mixed-100)
    }

    .productButton:hover{
        cursor:pointer;
        background-color: var(--color-surface-mixed-100);
        color: var(--color-surface-mixed-600)
    }


    @media (max-width: 769px) {
        .largerScreen {
            display: none !important;
        }

        .smallerScreen {
            display: flex !important;
        }
    }

    @media (min-width: 768px) {
        .largerScreen {
            display: flex !important;
        }

        .smallerScreen {
            display: none !important;
        }
    }


  </style>