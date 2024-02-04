<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import * as Avatar from "$lib/components/ui/avatar";

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
                <div>
                    <Card.Header>
                        <Card.Title class="flex items-center justify-between fill-destructive">
                            <span>
                                {object.name}
                            </span>

                            <Button size="icon" variant="ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    ><path
                                        d="M15 2H9c-1.103 0-2 .897-2 2v2H3v2h2v12c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V8h2V6h-4V4c0-1.103-.897-2-2-2zM9 4h6v2H9V4zm8 16H7V8h10v12z"
                                    ></path></svg
                                >
                            </Button>
                        </Card.Title>
                        <Card.Description>{object.category}</Card.Description>
                    </Card.Header>

                    <Card.Footer>
                        {#if object.transaction}
                            <Button>Prêter à {object.receiver_name}</Button>
                        {/if}
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
        {:else}
            <p class="p">Vous n'avez aucun article!</p>

            <Button class="self-start" href="/new">Afficher un article</Button>
        {/each}
    </div>
</main>
