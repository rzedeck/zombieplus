import { test } from "../support/index"
import data from '../support/fixture/movies.json' //assert { type: 'json' }
import { executeSQL } from "../support/database"

test('Cadastro Válido de um novo Filme com apenas campos obrigatórios', async ({ page }) => {
    const movie = data.guerra_mundial_z // massa de teste vinda de um arquivo
    await executeSQL(`DELETE FROM public.movies WHERE title='${movie.title}';`)
    console.log(movie.title)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.movies.insertMovieMinParams(movie)
    const popupMessage = `O filme '${movie.title}' foi adicionado ao catálogo.`
    await page.popup.haveText(popupMessage)
})

test('Cadastro Válido de um novo Filme com todos os campos', async ({ page }) => {
    const movie = data.a_noite_dos_mortos_vivos // massa de teste vinda de um arquivo
    await executeSQL(`delete from public.movies where title='${movie.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.movies.insertMovieAllParams(movie)
    const popupMessage = `O filme '${movie.title}' foi adicionado ao catálogo.`
    await page.popup.haveText(popupMessage)
})

test('Remoção com sucesso de um filme cadastrado ', async ({ page, request }) => {
    const movie = data.exterminio // massa de teste vinda de um arquivo
    await executeSQL(`delete from public.movies where title='${movie.title}';`)
    await request.api.postMovie(movie)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    /* Xpath:
    //td[text()="Extermínio"]/..//button
     */
    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})

test('Cadastro Inválido de um novo Filme - Filme já cadastrado', async ({ request, page }) => {
    const movie = data.resident_evil_o_hospedeiro // massa de teste vinda de um arquivo
    await executeSQL(`delete from public.movies where title='${movie.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    /*await page.movies.insertMovieMinParams(movie)
    await page.toast.containText('Cadastro realizado com sucesso!')*/
    await request.api.postMovie(movie)
    await page.movies.insertMovieMinParams(movie)
    const popupMessage = `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item`
    await page.popup.containText(popupMessage)
})

test('Cadastro Inválido de um novo Filme - Todos os campos obrigatórios em branco', async ({ page }) => {
    /*await page.login.visit()
    await page.login.submitLoginForm('admin@zombieplus.com','pwd123')
    await page.login.isLoggedIn()*/
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.movies.openForm()
    await page.movies.submitForm()
    await page.movies.alertHaveText(['Campo obrigatório','Campo obrigatório','Campo obrigatório','Campo obrigatório'])
})

test('Procura por termo "zumbi"', async ({ page, request }) => {
    const movies = data.search
    movies.data.forEach(async (mov) => {
        await executeSQL(`delete from public.movies where title='${mov.title}';`)
    })
   movies.data.forEach(async (mov) => {
        await request.api.postMovie(mov)
    })
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.movies.searchMovie(movies.input)
    await page.movies.tableHave(movies.outputs)
})