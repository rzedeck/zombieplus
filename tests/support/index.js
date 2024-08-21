import {test as base, expect} from '@playwright/test'
import { Leads } from "./actions/Leads"
import { Login } from "./actions/Login"
import { Movies } from "./actions/Movies"
import { PopUp } from "./actions/Components"
import { Api } from "./api"
import { TVShows } from './actions/TVShows'

/*
    fixture com mesmo contexto do page
    const test = base.extend({
        play : async ({page}, use) =>{
            await use(page)
        }
    })
*/
const test = base.extend({
    page : async ({page}, use) =>{
        const context = page
        context['leads'] = new Leads(page)
        context['login'] = new Login(page)
        context['movies'] = new Movies(page)
        context['popup'] = new PopUp(page)
        context['tvshows'] = new TVShows(page)
        await use(context)
    },

    request: async ({ request }, use) =>{
        const context = request
        context['api'] = new Api(request)
        await context['api'].setToken()
        await use (context)
    }
})

export { test, expect }