<script lang="ts">
    import "../app.pcss";

    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover";
    import { signOut } from "@auth/sveltekit/client";
    import { onMount } from "svelte";

    export let data;

    onMount(async () => {
        if (!data.user) return;
        const loc = await new Promise<GeolocationPosition>((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej)
        );
        console.log("🚀 ~ onMount ~ loc:", loc);
        const res = await fetch("/api/position", {
            method: "POST",
            body: JSON.stringify({ lat: loc.coords.latitude, lng: loc.coords.longitude }),
            headers: {
                "content-type": "application/json",
            },
        });
        console.log(res);
    });
</script>

<svelte:head>
    <title>Commu Partage</title>
</svelte:head>

<header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div class="container flex h-14 max-w-screen-2xl items-center justify-between">
        <a href="/" class="text-lg font-bold">CommuPartage</a>

        <div class="flex items-center gap-4">
            <Button variant="outline" href="/profile">À propos</Button>

            {#if data.user}
                <Button variant="outline" href="/profile">Profil</Button>

                <Popover.Root>
                    <Popover.Trigger>
                        <Avatar.Root class="h-8 w-8">
                            <Avatar.Image
                                src={"https://storage.googleapis.com/commupartage_user_images/" +
                                    data.user.id}
                                alt={data.user.name}
                            />
                            <Avatar.Fallback>
                                {data.user.name?.at(0)?.toUpperCase()}
                            </Avatar.Fallback>
                        </Avatar.Root>
                    </Popover.Trigger>

                    <Popover.Content class="w-80">
                        <div class="grid gap-4">
                            <div>
                                <small class="text-muted-foreground">Connecté en tant que</small>
                                <h4 class="font-medium leading-none">{data.user.name}</h4>
                            </div>

                            <div class="grid gap-2">
                                <Button on:click={() => signOut()}>Se déconnecter</Button>
                            </div>
                        </div>
                    </Popover.Content>
                </Popover.Root>
            {:else}
                <Button href="/login">Se connecter</Button>
            {/if}
        </div>
    </div>
</header>

<slot />
