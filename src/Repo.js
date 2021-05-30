import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export default class RepoPage extends Component {
  render() {
    console.log(this.props);
    const QUERY = gql`
      query {
        repository(name: "${this.props.name}", owner: "${this.props.owner}") {
          createdAt
          updatedAt
          issues {
            totalCount
          }
          languages(first: 10) {
            totalCount
            edges {
              size
              node {
                color
                name
              }
            }
          }
          forkCount
        }
      }
    `;
    return (
      <div>
        <Query query={QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error! {error.message}</p>;
            return (
              <div>
                <div className="info">
                  <p>
                    <b>:</b> {data.repository.createdAt}
                  </p>
                  <p>
                    <b>Созданный:</b> {data.repository.updatedAt}
                  </p>
                  <p>
                    <b>Количество проблем:</b>{" "}
                    {data.repository.issues.totalCount}
                  </p>
                  <p>
                    <b>Количество форков:</b> {data.repository.forkCount}
                  </p>
                </div>

                <div className="languages">
                  <h3>Использование языков:</h3>
                  {data.repository.languages.edges.map((data, key) => {
                    return (
                      <div key={key}>
                        <p>
                          {data.node.name}, Код подсчета символов: {data.size}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
