/* global exports */

exports.schemas = [{
  // Only used for social login. We'll remove this later.
  name: 'userProviderAccounts',
  properties: {
    username: {
      type: String
    }, // Assigned by us
    provider: {
      type: String,
      enum: ['google', 'twitter', 'facebook'],
      required: true
    },
    idWithProvider: {
      type: String,
      required: true
    }, // Assigned by the provider
    emails: [{
      type: String
    }],
    displayName: {
      type: String
    },
    oauthToken: {
      type: String
    },
    oauthSecret: {
      type: String
    },
    tokenExpirationDate: {
      type: Date
    }
  }
}, {
  // Represents a user of a system.
  name: 'users',
  properties: {
    userId: Number,
    firstName: String,
    lastName: String
  }
}, {
  // Represents a filter.
  name: 'filters',
  properties: {
    filterId: Number,
    displayName: String,
    filterType: String
  }
}];