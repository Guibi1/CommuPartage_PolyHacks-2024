<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    export let data;
</script>

<main class="container flex flex-col py-8">
    <div class="mb-4 flex items-center gap-4">
        <Avatar.Root class="h-16 w-16">
            <Avatar.Image src={data.user.avatar} alt={data.user.name} />
            <Avatar.Fallback>{data.user.name.at(0)?.toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>

        <h1 class="h1">{data.user.name}</h1>
    </div>

    <h2 class="h2">Mes articles</h2>
    <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.objects as object}
            <Card.Root class="grid grid-cols-2">
                <div class="flex flex-col justify-between">
                    <Card.Header>
                        <Card.Title>{object.name}</Card.Title>
                        <Card.Description>{object.category}</Card.Description>
                    </Card.Header>

                    <Card.Footer>
                        <Button href="/borrow">Louer</Button>
                    </Card.Footer>
                </div>

                <div class="p-6 pl-0">
                    <img
                        src={`https://storage.googleapis.com/commupartage_object_images/${object.id}`}
                        alt="L'objet à louer"
                        class="h-40 rounded-lg border object-cover"
                    />
                </div>
            </Card.Root>
        {:else}
            <p class="p">Cet utilisateur n'offre aucun article pour l'instant</p>

            <Button href="/" class="self-start">Accueil</Button>
        {/each}
    </div>
</main>
