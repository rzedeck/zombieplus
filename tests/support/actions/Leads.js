import {expect} from "../index"

export class Leads {

    constructor(page){
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/')
    }

    async openLeadModal() {
        await this.page.getByRole('button', { name: /Aperte o play/ }).click()
        await expect(this.page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')
    }

    async submitLeadForm(name, email) {
        await this.page.locator('input[name=name]').fill(name)//locator(ELEMENT[PROPERTY=VALUE])
        await this.page.locator('input[name=email]').fill(email)
        await this.page.getByTestId('modal').getByText('Quero entrar na fila!').click()
    }

    async alertHaveText(target){
        await expect(this.page.locator('.alert')).toHaveText(target)
    }
}