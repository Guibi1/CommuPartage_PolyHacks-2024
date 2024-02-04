<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";

    export let data: PageData;
    let loading = false;

    let name = "";
    let value = "5";
    let file: File;

    function fileChange(e: any) {
        file = e.target.files[0];
        console.log("🚀 ~ fileChange ~ file:", file);
    }

    async function createObject() {
        if (!file.size || !name) return;

        loading = true;
        const resBucket = await fetch(data.signedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/octet-stream",
            },
            body: await file.arrayBuffer(),
        });

        if (resBucket.ok) {
            const res = await fetch("/api/object", {
                method: "POST",
                body: JSON.stringify({ id: data.id, name, value }),
                headers: {
                    "content-type": "application/json",
                },
            });

            if (res.ok) {
                await invalidateAll();
                goto("/profile");
            }
        }

        loading = false;
    }
</script>

<main class="p container my-8 max-w-screen-sm">
    <h1 class="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Prêter un objet
    </h1>

    <Label>
        <span>Nom de l'article</span>

        <Input bind:value={name} />
    </Label>

    <Label>
        <span>Valeur estimé</span>

        <Input bind:value min="0" max="300" type="number" />
    </Label>

    <Label>
        <span>Image</span>

        <Input on:change={fileChange} type="file" />
    </Label>

    <Button on:click={createObject} disabled={loading} class="mt-4">Submit</Button>
</main>
