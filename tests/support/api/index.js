import {expect} from "../index"
import * as fs from "fs"

export class Api {
    constructor (request) {
        this.request = request
        this.token = undefined
    }

    async setToken(){
        const response = (await this.request.post('http://localhost:3333/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        }))
        const body = await response.json()
        this.token = body.token
        await expect(response.ok()). toBeTruthy()
    }

    async getCompanyIDByName(companyName){
        const response = await this.request.get('http://localhost:3333/companies', {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params: {
                name: companyName
            }
        })
        expect(response.ok()).toBeTruthy()
        const body = await response.json()
        return body.data[0].id
    }

    async postMovie (movie) {
        const companyID = await this.getCompanyIDByName(movie.company)
        const response = await this.request.post('http://localhost:3333/movies', {
            headers: {
                Authorization: `Bearer ${this.token}`,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */**'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyID,
                release_year: movie.release_year,
                featured: movie.featured
            }
        })
        expect(response.ok()).toBeTruthy()
    }

    async postShow (show) {
        
        const image = fs.readFileSync('tests/support/fixture/covers/tvshows/' + show.cover)
        console.log(typeof image)
        console.log(image)
        const companyID = await this.getCompanyIDByName(show.company)
        const response = await this.request.post('http://localhost:3333/tvshows', {
            headers: {
                Authorization: `Bearer ${this.token}`,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */**'
            },
            multipart: {
                cover: {//todo review how to send the cover
                    filename: show.cover,
                    ContentType : "image/jpeg",
                    Buffer: image
                },
                title: show.title,
                overview: show.overview,
                company_id: companyID,
                release_year: show.release_year,
                seasons: show.seasons,
                featured: show.featured
            }
        })
        expect(response.ok()).toBeTruthy()
    }

}