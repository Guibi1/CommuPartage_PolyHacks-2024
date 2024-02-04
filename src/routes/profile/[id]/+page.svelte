<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { invalidateAll } from "$app/navigation";
    import { Slider } from "$lib/components/ui/slider";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Label } from "$lib/components/ui/label";

    export let data;
    let evaluate = false;
    let evalDes = "";
    let rating = [2];

    async function borrowObject(id: string) {
        const res = await fetch("/api/borrow", {
            method: "POST",
            body: JSON.stringify({ object_id: id, lender_id: data.user.id }),
            headers: {
                "content-type": "application/json",
            },
        });
        await invalidateAll();
        console.log(res);
    }

    async function sendEval() {
        evaluate = false;
        const res = await fetch("/api/evaluate", {
            method: "POST",
            body: JSON.stringify({
                user_id: data.user.id,
                writer_id: data.currUser?.id,
                description: evalDes,
                rating: rating[0],
            }),
            headers: {
                "content-type": "application/json",
            },
        });
        // await invalidateAll();
        console.log(res);
        evalDes = "";
        rating = [2];
    }
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
                        <Button
                            on:click={() => borrowObject(object.id)}
                            disabled={!!object.transaction}>Louer</Button
                        >
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
        {/each}
    </div>

    <h2 class="h2">Évaluations</h2>

    <div class="mb-4 grid gap-4">
        <div class="m-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.reviews as review}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>{review.rating}/5</Card.Title>
                        <Card.Description>
                            <a href={`/profile/${review.writer.id}`}>
                                Par {review.writer.name}
                            </a>
                        </Card.Description>
                    </Card.Header>

                    <Card.Content>
                        {review.description}
                    </Card.Content>
                </Card.Root>
            {:else}
                <p class="p">Vous n'avez aucune évaluation!</p>
            {/each}
        </div>

        {#if !evaluate}
            <Button on:click={() => (evaluate = true)}>Ajouter une évaluation</Button>
        {:else}
            <div class="flex justify-center">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Nouvelle évaluation</Card.Title>
                    </Card.Header>

                    <Card.Content class="grid gap-2 md:min-w-80">
                        <Label class="grid gap-4">
                            <span>Score ({rating[0]}/5)</span>

                            <Slider bind:value={rating} min={1} max={5} step={1} />
                        </Label>

                        <Textarea bind:value={evalDes} placeholder="Entrez votre message ici" />
                    </Card.Content>

                    <Card.Footer>
                        <Button on:click={sendEval}>Envoyer</Button>
                    </Card.Footer>
                </Card.Root>
            </div>
        {/if}
    </div>
</main>
