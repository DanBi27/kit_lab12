import { Query } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import RepositoryInfo from "./Repo";
const QUERY = gql`
  query {
    viewer {
      id
      login
      repositories(first: 10) {
        nodes {
          name
          url
          owner {
            login
          }
        }
      }
    }
  }
`;

export default class UserRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "",
      name: "",
      isPage: false
    };
  }
  render() {
    return (
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Enter your token</p>;
          const prs = data.viewer.repositories.nodes;
          if (!this.state.isPage) {
            return (
              <div>
                <h2>Repositories</h2>
                <ul>
                  {prs.map((data, key) => {
                    return (
                      <li
                        key={key}
                        onClick={() => {
                          this.setState(() => {
                            return {
                              owner: data.owner.login,
                              name: data.name,
                              isPage: true
                            };
                          });
                        }}
                      >
                        <a>{data.name}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          } else
            return (
              <div>
                <RepositoryInfo
                  name={this.state.name}
                  owner={this.state.owner}
                />
              </div>
            );
        }}
      </Query>
    );
  }
}
