import React, { Component } from 'react';
import moment from 'moment';
import logo from '../../assets/logo.png';
import CompareList from '../../components/CompareList';
import { Container, Form } from './styles';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  componentDidMount = async () => {
    this.setState({
      loading: true,
    });

    this.setState({
      loading: false,
      repositories: await this.getLocalRepositories(),
    });
  };

  setLocalRepositories = (repos) => {
    localStorage.setItem('searchedRepos', JSON.stringify(repos));
  };

  removeRepository = async (id) => {
    await this.setState({ repositories: this.state.repositories.filter(repo => repo.id !== id) });
    this.setLocalRepositories(this.state.repositories);
  };

  getLocalRepositories = () => (localStorage.getItem('searchedRepos') !== null
    ? JSON.parse(localStorage.getItem('searchedRepos'))
    : []);

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      await this.setState({
        repositories: [...this.state.repositories, repository],
        repositoryInput: '',
        repositoryError: false,
      });

      this.setLocalRepositories(this.state.repositories);
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      repositoryError, repositoryInput, repositories, loading,
    } = this.state;

    return (
      <Container>
        <img src={logo} alt="GitHub Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="Digite um usuário do GitHub"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />

          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'Ok'}</button>
        </Form>

        <CompareList removeRepo={this.removeRepository} repositories={repositories} />
      </Container>
    );
  }
}
