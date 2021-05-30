import { Query } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import Repo from "./Repo";

export default class PubRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      isSearch: false,
      searchText: "*",
      cursor: "$afterCursor",
      queryValue: "Search($afterCursor: String)",
      page: "after: ",
      owner: "",
      name: "",
      isPage: false
    };
  }
  searchButton() {
    this.setState(() => {
      return {
        isDefault: false,
        isSearch: true,
        searchText: document.getElementById("searchInput").value
      };
    });
  }
  nextPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "after: "
      };
    });
  }
  prevPage(cursor) {
    let temp = cursor.toString();
    this.setState(() => {
      return {
        cursor: '"' + temp + '"',
        queryValue: "Search",
        page: "before: "
      };
    });
  }
  toRepo(owner, name) {
    this.setState(() => {
      return {
        owner: owner,
        name: name,
        isPage: true
      };
    });
  }

  render() {
    const DEFAULT_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "is:public", type: REPOSITORY, ${
        this.state.page + this.state.cursor
      }, first: 10) {
    repositoryCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 100)
          url
        }
      }
    }
  }
}
  `;
    let queryText = this.state.searchText;
    const SEARCH_QUERY = gql`
    query ${this.state.queryValue}{
      search(query: "${queryText}", type: REPOSITORY, ${
      this.state.page + this.state.cursor
    }, first: 10) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ... on Repository {
        id
        name
        owner {
          login
          avatarUrl(size: 100)
          url
        }
      }
    }
  }
}
  `;
    return (
      <Query query={this.state.isDefault ? DEFAULT_QUERY : SEARCH_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error! {error.message}</p>;
          const prs = data.search;
          if (!this.state.isPage) {
            return (
              <div className="PublicRep">
                <br />
                <input id="searchInput" placeholder="Type..." />
                <button class="but" onClick={() => this.searchButton()}>
                  Search
                </button>

                {prs.nodes.map((data, key) => {
                  return (
                    <div
                      className="rep_list"
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
                      <img src={data.owner.avatarUrl} alt="" />
                      <p>
                        Repository: <a className="name">{data.name}</a>
                        <br />
                        from <a className="login">{data.owner.login}</a>
                      </p>
                    </div>
                  );
                })}
                {prs.pageInfo.hasPreviousPage && (
                  <button
                    class="but"
                    onClick={() => this.prevPage(prs.pageInfo.startCursor)}
                  >
                    Предыдущая
                  </button>
                )}
                <button
                  class="but"
                  onClick={() => this.nextPage(prs.pageInfo.endCursor)}
                >
                  Следущая
                </button>
              </div>
            );
          } else
            return (
              <div>
                <br />
                <button
                  class="but"
                  onClick={() => {
                    this.setState(() => {
                      return {
                        isPage: false
                      };
                    });
                  }}
                >
                  Назад
                </button>
                <Repo name={this.state.name} owner={this.state.owner} />
              </div>
            );
        }}
      </Query>
    );
  }
}
