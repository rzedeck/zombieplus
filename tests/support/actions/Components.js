import {expect} from "../index"

export class PopUp {
    constructor(page) {
        this.page = page
    }

    async haveText(message) {
        /*Método para pegar informaçao de modais/pop-ups
        await this.page.getByText('efetuar o login').click()
        const content = await this.page.content()
        console.log(content)*/
        /*
        const toast = this.page.locator('.toast')
        await expect(toast).toHaveText(message)
        await expect(toast).toBeHidden({ timeout: 5000 })
        */
        const element = this.page.locator('.swal2-html-container')
        await expect(element).toHaveText(message)
    }

    async containText(message) {
        /*const toast = this.page.locator('.toast')
        await expect(toast).toContainText(message)
        await expect(toast).toBeHidden({ timeout: 5000 })*/

        const element = this.page.locator('.swal2-html-container')
        await expect(element).toContainText(message)
    }

}