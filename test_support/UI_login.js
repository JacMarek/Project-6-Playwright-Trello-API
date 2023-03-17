const testData = require('../test_data/testData.json')

class UILogin {

    constructor(page) {
        this.page = page
        this.loginBtn = page.locator('[href="/login"].kTwZBr')
        this.loginField = page.locator('#user')
        this.passField = page.locator('#password')
    }
        
    async logIn() {
        await this.loginBtn.click()
        await this.page.waitForURL('**/login')
        await this.loginField.type(testData.login)
        await this.loginField.press('Enter')
        await this.page.waitForURL('https://id.atlassian.com/*', { waitUntil: "networkidle"})
        await this.passField.type(testData.pass)
        await this.passField.press('Enter')
        await this.page.waitForURL('https://trello.com/*', { waitUntil: "networkidle"})
    }
}

module.exports = {UILogin}