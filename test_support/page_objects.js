const testData = require('../test_data/testData.json')

class WorkSpace {

    constructor(page) {
        this.page = page
        this.boardsBtnOnMenu = page.locator('[data-testid="home-team-boards-tab"]')
        this.boardOnTheList = page.locator('.boards-page-board-section-list > li > a')
    }

    async goToBoards() {
        await this.boardsBtnOnMenu.click()
    }

    async getBoardByName(name) {
        const boards = await this.boardOnTheList.filter({ hasText: name })
        return boards.first()
    }
}

module.exports = {WorkSpace}