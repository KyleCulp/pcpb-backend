import { authenticationResolver } from './authenticationResolver';

export const graphqlResolvers = () => {
  return [authenticationResolver];
};
