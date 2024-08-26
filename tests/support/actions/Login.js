import {expect} from "../index"

export class Login {

    constructor(page){
        this.page = page
    }

    async makeLogin(email, password, userName){
        await this.visit()
        await this.submitLoginForm(email,password)
        await this.isLoggedIn(userName)
    }

    async visit(){
        await this.page.goto('/admin/login')
        const loginForm = this.page.locator('.login-form')
        await expect(loginForm).toBeVisible()
    }

    async isLoggedIn(userName){
        /*await this.page.waitForLoadState('networkidle')
        await expect(this.page).toHaveURL(/.*admin/)*/
        const loggedUser = this.page.locator('.logged-user')
        await expect(loggedUser).toHaveText(`Olá, ${userName}`)
    }

    async submitLoginForm(email, password) {
        await this.page.getByPlaceholder('E-mail').fill(email)
        await this.page.getByPlaceholder('Senha').fill(password)
        await this.page.locator('//button[text()="Entrar"]').click()
        //await this.page.getByText('Entrar').click()
    }

    async alertHaveText(target){
        await expect(this.page.locator('span[class$=alert]')).toHaveText(target)
    }
}