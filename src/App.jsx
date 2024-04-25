/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(
      categoryWithId => product.categoryId === categoryWithId.id,
    ) || null;

  const user =
    usersFromServer.find(
      userOwnerId => category && userOwnerId.id === category.ownerId,
    ) || null;

  return {
    ...product,
    category,
    user,
  };
});

const SELECTED_USER = ['All', 'Roma', 'Anna', 'Max', 'John'];
const CATEGORIES = ['Grocery', 'Drinks', 'Fruits', 'Electronics', 'Clothes'];
const COLUMNS = ['ID', 'Product', 'Category', 'User'];

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('');

  const normalizedQuery = query.toLowerCase().trim();

  let filteredProducts = [...products];

  if (normalizedQuery !== '') {
    filteredProducts = filteredProducts.filter(product => {
      const normalizedProductName = product.name.toLowerCase().trim();

      return normalizedProductName.includes(normalizedQuery);
    });
  }

  if (selectedUser !== 'All') {
    filteredProducts = filteredProducts.filter(
      product => selectedUser === product.user.name,
    );
  }

  if (selectedCategory !== '') {
    filteredProducts = filteredProducts.filter(
      category => selectedCategory === category.category.title,
    );
  }

  const handleResetAll = () => {
    setQuery('');
    setSelectedUser('All');
    setSelectedCategory('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {SELECTED_USER.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user}
                  className={cn({
                    'is-active': selectedUser === user,
                  })}
                  onClick={() => setSelectedUser(user)}
                >
                  {user}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query !== '' && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategory('')}
              >
                All
              </a>
              {CATEGORIES.map(category => (
                <a
                  key={category}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategory === category,
                  })}
                  href="#/"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {COLUMNS.map(column => (
                    <th key={column}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {column}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex !== 'm'
                          ? 'has-text-danger'
                          : 'has-text-link'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
