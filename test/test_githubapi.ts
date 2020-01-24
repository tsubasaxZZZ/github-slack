import * as ga from '../githubapi';
import { describe } from 'mocha';
import { expect } from 'chai';

const testConfig = {
    owner: "tsubasaxZZZ",
    repositoryName: "testrepository"
}
describe('githubissue api', () => {
    it('test createGitHubIssue', async () => {
        const [v, errors] = await ga.createGitHubIssue({
            author: "tsubasaxZZZ",
            repositoryName: "testrepository",
            title: "testtitle",
            body: "body",
            labelName: "hogehoge"
        });
        if (errors)
            console.log(errors);
        expect(v.title).equals("testtitle");
    });
    it('test getGitHubRepositoryIDByName', async () => {
        const [v, errors] = await ga.getGitHubRepositoryIDByName({ owner: "tsubasaxZZZ", repositryName: "testrepository" });
        if (errors)
            console.log(errors);
        expect(v).equals("MDEwOlJlcG9zaXRvcnkyMzU2MjI0OTA=");
    });
    // ラベルが存在しない場合 = 新規作成
    it('createLabel1', async () => {
        const [data, errors] = await ga.createLabel(testConfig.repositoryName, testConfig.owner, "pgr");
        if (errors)
            console.log(errors);
        // label id がランダムで返ってくるので空でなければOKとする
        expect(data).not.equal('');

        const [data2, errors2] = await ga.deleteLabel(testConfig.repositoryName, testConfig.owner, "pgr");
        if (errors2)
            console.log(errors2);
    });
    // ラベルが存在する場合 = 新規にラベルを作らずに、既存のラベルIDを返す
    it('createLabel2', async () => {
        const [data, errors] = await ga.createLabel(testConfig.repositoryName, testConfig.owner, "hogehoge");
        if (errors)
            console.log(errors);
        expect(data).to.equal('MDU6TGFiZWwxODA2NjU1MTc0');

    });
    // 存在するタグをテスト
    it('findLabel1', async () => {
        const [data, errors] = await ga.findLabelIdByName("testrepository", "tsubasaxZZZ", "hogehoge");
        if (errors)
            console.log(errors);
        expect(data).equals("MDU6TGFiZWwxODA2NjU1MTc0");
    });
    // 存在しないタグをテスト
    it('findLabel2', async () => {
        const [data, errors] = await ga.findLabelIdByName("testrepository", "tsubasaxZZZ", "notexists");
        if (errors)
            console.log(errors);
        expect(data).equals(null);
    })
});
