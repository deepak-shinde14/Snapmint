export async function findWorkingLocator(
    locators,
    elementName,
    options = {}
) {
    const {
        timeout = 2000,
        requireVisible = true
    } = options;

    for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];

        try {
            if (requireVisible) {
                await locator.waitFor({
                    state: 'visible',
                    timeout
                });
            } else {
                await locator.waitFor({
                    state: 'attached',
                    timeout
                });
            }

            console.log(
                `[SELF-HEAL] ${elementName} found using locator #${i + 1}`
            );

            return locator;

        } catch (error) {
            console.log(
                `[SELF-HEAL] Locator #${i + 1} failed for ${elementName}`
            );
        }
    }

    throw new Error(
        `[SELF-HEAL] Unable to locate "${elementName}" using ${locators.length} locators`
    );
}