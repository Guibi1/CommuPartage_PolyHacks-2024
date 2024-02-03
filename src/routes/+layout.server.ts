export const load: LayoutServerLoad = async ({ locals }) => {
    const sesssion = await locals.auth();
    console.log(sesssion);
};
