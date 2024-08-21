import { expect } from "../index"

export class TVShows {
    constructor(page) {
        this.page = page
    }

    async visit(){
        await this.page.goto('http://localhost:3000/admin/tvshows')
        const loginForm = this.page.locator('a[href$="tvshows"]')
        await expect(loginForm).toBeEnabled()
    }

    async openForm(){
        await this.page.locator('a[href$="register"]').click()
    }

    async submitForm(){
        await this.page.getByRole('button', {name: 'Cadastrar'}).click()
    }

    async fillForm(showData){
        await this.page.getByLabel('Titulo da série').fill(showData.title)
        await this.page.getByLabel('Sinopse').fill(showData.overview)
        await this.page.locator('#select_company_id .react-select__indicator').click()
        await this.page.locator('.react-select__option').filter({hasText: showData.company}).click()
        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option').filter({hasText: showData.release_year}).click()
        await this.page.getByLabel('Temporadas').fill(String(showData.seasons))
    }

    async insertShowMinParams(showData){
        await this.openForm()

        await this.fillForm(showData)

        await this.submitForm()
    }

    async insertShowAllParams(showData){
        await this.openForm()

        await this.fillForm(showData)
        await this.page.locator('input[name=cover]').setInputFiles('tests/support/fixture' + showData.cover)
        if (showData.featured){
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submitForm()
    }

    async remove(title){
        await this.page.getByRole('row', {name: title}).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }

    async alertHaveText(target){
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async searchShow(target){
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)
        await this.page.click('.actions button')
    }

    async tableHave(content){
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content, {timeout: 7000})
    }
}