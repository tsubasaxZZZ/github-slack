import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as dotenv from "dotenv";
/**
 * Config
 */
dotenv.config({ path: `${__dirname}/.env` });
const ACCESS_TOKEN = process.env.GH_PAT;
const ENDPOINT = "https://api.github.com/graphql";

type Issue = {
    author: string,
    repositoryName: string,
    title: string,
    body: string,
    labelName: string,
};

type Repository = {
    owner: string,
    repositryName: string;
}

export async function findLabelIdByName(repositoryName: string, owner: string, labelName: string) {

    const query = `query  {
  repository(name: "${repositoryName}", owner: "${owner}") {
    label(name: "${labelName}") {
      id
      name
    }
  }
}
`;

    const [data, errors] = await queryGitHubAPI(query);
    if (errors) {
        return [null, errors];
    } else if (data.repository.label == null) {
        return [null, `${labelName} isn't exists.`];
    } else {
        return [data.repository.label.id, null];
    }

}
export async function createLabel(repositoryName: string, owner: string, labelName: string) {
    const repositoryId = await getGitHubRepositoryIDByName({ owner: owner, repositryName: repositoryName });

    const [existsLabelId, findLabelErrors] = await findLabelIdByName(repositoryName, owner, labelName);
    if (existsLabelId) {
        return [existsLabelId, null];
    }

    const mutation = `mutation {
    createLabel(input:{color:"ff0000", name:"${labelName}", repositoryId:"${repositoryId}"}) {
      label {
        name,
        id
      }
    }
  }`;

    const [data, errors] = await queryGitHubAPI(mutation);
    if (errors) {
        return [null, errors];
    } else {
        return [data.createLabel.label.id, null];
    }
}
export async function deleteLabel(repositoryName: string, owner: string, labelName: string) {
    const labelId = await findLabelIdByName(repositoryName, owner, labelName);

    const mutation = `mutation {
    deleteLabel(input:{id:"${labelId}"}) {
        clientMutationId
    }
  }`;

    const [data, errors] = await queryGitHubAPI(mutation);
    return [data, errors];
}

async function queryGitHubAPI(query: string) {

    const options: AxiosRequestConfig = {
        url: ENDPOINT,
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN,
            'Accept': 'application/vnd.github.bane-preview+json',
            'contentType': 'application/json',
        },
        data: JSON.stringify({ query: query })
    };
    const { data } = await axios.request(options);
    return [data.data, data.errors];
}

export async function createGitHubIssue(issue: Issue) {
    const repositoryId = await getGitHubRepositoryIDByName({ owner: issue.author, repositryName: issue.repositoryName });
    const title = issue.title;
    const body = issue.body;
    const [labelId, labelError] = await createLabel(issue.repositoryName, issue.author, issue.labelName);
    const mutation = `mutation {
    createIssue(input:{repositoryId:"${repositoryId}", title:"${title}", body:"${body}", labelIds:["${labelId}"]}) {
      issue {
        title,
        url
      }
    }
  }`;

    const [data, errors] = await queryGitHubAPI(mutation);
    if (errors) {
        return [null, errors];
    } else {
        return [data.createIssue.issue, null];
    }
}

export async function getGitHubRepositoryIDByName(repository: Repository) {
    const query = `
    query{
        repository(owner:"${repository.owner}",name:"${repository.repositryName}"){
            id
        }
}`;

    const [data, errors] = await queryGitHubAPI(query);
    if (errors) {
        return [null, errors];
    } else {
        return [data.repository.id, null];
    }
}
