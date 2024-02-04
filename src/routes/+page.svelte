<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { object } from "zod";

    export let data;
</script>

<main class="container py-8">
    <div class="mb-4 flex justify-between">
        <h1 class="h1">Articles à louer</h1>

        {#if data.user}
            <Button href="/new">Create object</Button>
        {/if}
    </div>

    <div class="grid grid-cols-3">
        <div class="col-span-2">carte</div>

        <div class="m-4 flex flex-col gap-2">
            {#each data.objects as object}
                <Card.Root class="grid grid-cols-2">
                    <div>
                        <Card.Header>
                            <Card.Title>{object.name}</Card.Title>
                            <Card.Description>{object.category}</Card.Description>
                        </Card.Header>

                        <Card.Footer>
                            <Button>Louer</Button>
                        </Card.Footer>
                    </div>

                    <div class="p-6 pl-0">
                        <img
                            src={`https://storage.googleapis.com/commupartage_object_images/${object.image}`}
                            alt="L'objet à louer"
                            class="h-40 rounded-lg border object-cover"
                        />
                    </div>
                </Card.Root>
            {/each}
        </div>
    </div>
</main>
