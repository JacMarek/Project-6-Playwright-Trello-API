const {test, expect, request} = require('@playwright/test')
const {APICommands} = require('../test_support/api_commands')
const {UILogin} = require('../test_support/UI_login')
const {WorkSpace} = require('../test_support/page_objects')
const testData = require('../test_data/testData.json')

test.describe.configure({ mode: 'serial' })

test.beforeEach( async({context}) => {
    const APIContext = await request.newContext({baseURL: testData.baseURL})
    context.APICommand = new APICommands(APIContext)
})

// test.afterEach(async ({context}) => {
//     await context.close();
// })

test("1. Delete all boards", async({context}) => {
    const {APICommand} = context

    await APICommand.deleteAllBoards(testData.organizationId)
})

test("2. Create the necessary items and move the card between the lists", async({context}) => {
    const {APICommand} = context

    const board = await APICommand.createBoard('boardToTest')
    const list1 = await APICommand.createList('list1', board.id)
    const list2 = await APICommand.createList('list2', board.id)
    const card = await APICommand.createCard('cardToMove', list1.id)
    await APICommand.moveCard(card.id, list2.id)
})

test("3. Create boards in different colors and then delete them", async({context}) => {
    const {APICommand} = context
    await APICommand.deleteAllBoards(testData.organizationId)

    let i = 1
    for(const color of testData.boardColors) {
        
        await APICommand.createBoard('Colored board no '+i, color)
        i++
    }
    
    const allBoards = await APICommand.getAllBoards(testData.organizationId)
    expect(Object.keys(await allBoards)).toHaveLength(i-1) 
    await APICommand.deleteAllBoards(testData.organizationId)
})

test("4. Mix UI and API testing", async({context, page}) => {
    
    const {APICommand} = context
    const goUILogin = new UILogin(page)
    const onWorkSpace = new WorkSpace(page)

    page.on('request', request => console.log(request.url()))
    page.on('response', response => console.log(response.url(), response.status()))

    await page.goto("https://trello.com/")
    await goUILogin.logIn()
    await onWorkSpace.goToBoards()
    
    
    await APICommand.createBoard(`Orange Board`, 'orange')
    await APICommand.createBoard(`Green Board`, 'green')
    await APICommand.createBoard(`Blue Board`, 'blue')

    const boardToCheck = await onWorkSpace.getBoardByName(`Green Board`)

    const bgColor = await boardToCheck.evaluate( board => {
        const style = window.getComputedStyle(board)
        return style.getPropertyValue('background-color')
    })

      expect(await bgColor).toBe('rgb(81, 152, 57)')
})
