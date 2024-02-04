<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import * as Avatar from "$lib/components/ui/avatar";
    import Loader from "$lib/components/Loader.svelte";
    import { invalidateAll } from "$app/navigation";

    export let data;
    let loading = false;

    async function deleteObject(id: string) {
        loading = true;
        const res = await fetch("/api/object", {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: {
                "content-type": "application/json",
            },
        });
        await invalidateAll();
        loading = false;
    }
</script>

<main class="container flex flex-col py-8">
    <div class="mb-4 flex items-center gap-4">
        <Avatar.Root class="h-16 w-16">
            <Avatar.Image
                src={"https://storage.googleapis.com/commupartage_user_images/" + data.user.id}
                alt={data.user.name}
            />
            <Avatar.Fallback>{data.user.name.at(0)?.toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>

        <h1 class="h1">{data.user.name}</h1>
    </div>

    <h2 class="h2">Mes articles</h2>

    {#if loading}
        <Loader />
    {:else}
        <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.objects as object}
                <Card.Root class="grid grid-cols-2">
                    <div>
                        <Card.Header>
                            <Card.Title class="flex items-center justify-between fill-destructive">
                                <span>
                                    {object.name}
                                </span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    on:click={() => deleteObject(object.id)}
                                >
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
                            src={`https://storage.googleapis.com/commupartage_object_images/${object.id}`}
                            alt="L'objet à louer"
                            class="h-40 rounded-lg border object-cover"
                        />
                    </div>
                </Card.Root>
            {:else}
                <p class="p">Vous n'avez aucun article!</p>

                <Button class="self-start" href="/new">Afficher un article</Button>
            {/each}

            <a class="grid" href="/new">
                <Card.Root>
                    <div class="flex flex-col items-center justify-center gap-4 p-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4rem"
                            height="4rem"
                            viewBox="0 0 24 24"
                            class="fill-primary"
                            ><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path><path
                                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                            ></path></svg
                        >
                        <span>Ajouter un article</span>
                    </div>
                </Card.Root>
            </a>
        </div>
    {/if}

    <h2 class="h2">Évaluations</h2>

    <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.reviews as review}
            <div>
                {review.rating}
                <a href={`/profile/${review.writer.id}`}>
                    Par {review.writer.name}
                </a>
            </div>
        {:else}
            <p class="p">Vous n'avez aucune évaluation!</p>
        {/each}
    </div>
</main>
