const {expect} = require('@playwright/test')
const testData = require('../test_data/testData.json')

class APICommands {

    constructor(APIContext) {
        this.APIContext = APIContext
    }
        
    async createBoard(boardName, color) {

        const response = await this.APIContext.post(testData.boardsEndpoint, {
            data: {
                name: boardName,
                key: testData.key,
                token: testData.token,
                prefs_background: color,
            }
        })

        const responseJSON = await response.json()

        expect(await response.status()).toEqual(200)
        expect(await responseJSON.name).toBe(boardName)
        expect(await responseJSON.closed).toBe(false)

        // console.log(await responseJSON)
        return responseJSON
    }

    async createList(listName, boardId) {

        const response = await this.APIContext.post(testData.listsEndpoint, {
            data: {
                name: listName,
                idBoard: boardId,
                key: testData.key,
                token: testData.token,
            }
        })

        const responseJSON = await response.json()

        expect(await response.status()).toEqual(200)
        expect(await responseJSON.name).toBe(listName)
        expect(await responseJSON.closed).toBe(false)

        // console.log(await responseJSON)
        return responseJSON
    }

    async createCard(cardName, listId) {

        const response = await this.APIContext.post(testData.cardsEndpoint, {
            data: {
                name: cardName,
                idList: listId,
                key: testData.key,
                token: testData.token,
            }
        })

        const responseJSON = await response.json()

        expect(await response.status()).toEqual(200)
        expect(await responseJSON.idList).toBe(listId)
        expect(await responseJSON.name).toBe(cardName)
        expect(await responseJSON.closed).toBe(false)

        // console.log(await responseJSON)
        return responseJSON
    }

    async moveCard(cardId, listId) {

        const response = await this.APIContext.put(testData.cardsEndpoint+cardId, {
                data: {
                    idList: listId,
                    key: testData.key,
                    token: testData.token,
                }
            })
    
            const responseJSON = await response.json()
    
            expect(await response.status()).toEqual(200)
            expect(await responseJSON.idList).toBe(listId)
            expect(await responseJSON.closed).toBe(false)
    
            // console.log(await responseJSON)
            return responseJSON
    }

    async deleteBoard(boardId) {

        const response = await this.APIContext.delete(testData.boardsEndpoint+boardId, {
            data: {
                key: testData.key,
                token: testData.token,
            }
        })

        const responseJSON = await response.json()
        expect(await response.status()).toEqual(200)
        // console.log(await responseJSON)
        return responseJSON
    }

    async getAllBoards(organization) {

        const response = await this.APIContext.get(testData.organizationsEndpoint +organization+ '/boards', {
            data: {
                key: testData.key,
                token: testData.token,
            }
        })

        const responseJSON = await response.json()
        expect(await response.status()).toEqual(200)
        console.log(await responseJSON)
        return responseJSON
    }

    async deleteAllBoards(organization) {

        let allBoards = await this.getAllBoards(organization)   

        if (Object.keys(allBoards).length > 0) {

            await this.deleteBoard(allBoards[0].id)
            await this.deleteAllBoards(organization)
        }

        allBoards = await this.getAllBoards(organization)
        expect(Object.keys(await allBoards)).toHaveLength(0)
    }
}

module.exports = {APICommands}