<script lang="ts">
    import { Button } from "$lib/components/ui/button";
	import {signIn} from "@auth/sveltekit/client"
</script>

<h1>Welcome to SvelteKit</h1>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Button on:click={() => signIn("a0")}>WOW BUTTON</Button>
