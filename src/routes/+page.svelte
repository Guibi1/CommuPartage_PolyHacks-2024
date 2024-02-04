<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    export let data;
</script>

yey!

{#if data.user}
    <Button href="/new">Create object</Button>
{/if}
