import React, { Component } from "react";
import "./styles.css";
import PublicRep from "./PublicRep";
import UserRep from "./UserRep";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRepos: false,
      isUser: true
    };
  }

  //структура для поиска (кнопочная часть)
  render() {
    return (
      <div align="center">
        <button
          class="but"
          onClick={() => {
            this.setState(() => {
              return { isRepos: true, isUser: false };
            });
          }}
        >
          Репозитории публичных пользователей
        </button>
        <br />
        <br />
        <button
          class="but"
          onClick={() => {
            this.setState(() => {
              return { isRepos: false, isUser: true };
            });
          }}
        >
          Ваши репозитории
        </button>
        {this.state.isRepos && <PublicRep />}

        {this.state.isUser && <UserRep />}
      </div>
    );
  }
}

export default App;
