import { test } from "../support/index"
import data from "../support/fixture/tvshows.json"
import { executeSQL } from "../support/database"

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM public.tvshows`)
})


test('Cadastro Válido de uma nova Série com apenas campos obrigatórios', async ({ page }) => {
    const show = data.walking_dead
    await executeSQL(`DELETE FROM public.tvshows WHERE title='${show.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.insertShowMinParams(show)
    const popupMessage = `A série '${show.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(popupMessage)
})

test('Cadastro Válido de uma nova Série com todos os campos', async ({ page }) => {
    const show = data.fear_the_walking_dead
    await executeSQL(`delete from public.tvshows where title='${show.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.insertShowAllParams(show)
    const popupMessage = `A série '${show.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(popupMessage)
})

test('Remoção com sucesso de uma série cadastrada ', async ({ page, request }) => {
    const show = data.black_summer
    await executeSQL(`delete from public.tvshows where title='${show.title}';`)
    await request.api.postShow(show)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.remove(show.title)
    await page.popup.haveText('Série removida com sucesso.')
})

test('Cadastro Inválido de uma nova Série - Série já cadastrada', async ({ request, page }) => {
    const show = data.z_nation
    await executeSQL(`delete from public.tvshows where title='${show.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await request.api.postShow(show)
    await page.tvshows.visit()
    await page.tvshows.insertShowMinParams(show)
    const popupMessage = `O título '${show.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item`
    await page.popup.containText(popupMessage)
})

test('Cadastro Inválido de uma nova Série - Todos os campos obrigatórios em branco', async ({ page }) => {
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.openForm()
    await page.tvshows.submitForm()
    await page.tvshows.alertHaveText(['Campo obrigatório','Campo obrigatório','Campo obrigatório','Campo obrigatório','Campo obrigatório (apenas números)'])
})

test('Procura por termo "zombie"', async ({ page, request }) => {
    const shows = data.search
    /*shows.data.forEach(async (shw) => {
        await executeSQL(`delete from public.tvshows where title='${shw.title}';`)
    })*/
   shows.data.forEach(async (shw) => {
        await request.api.postShow(shw)
    })
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.searchShow(shows.input)
    await page.tvshows.tableHave(shows.outputs)
})