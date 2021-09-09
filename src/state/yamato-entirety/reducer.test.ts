import { Store, createStore } from '@reduxjs/toolkit';
import Pool from '../../components/Infographics/Pool';
import {
  fetchEvents,
  fetchRateOfEthJpy,
  fetchTokenState,
  fetchYamatoState,
} from './actions';
import reducer, {
  initialState,
  LogEvent,
  YamatoEntiretyState,
} from './reducer';

describe('yamato-entirety reducer', () => {
  let store: Store<YamatoEntiretyState>;

  beforeEach(() => {
    store = createStore(reducer);
  });

  it('has correct initial state', () => {
    expect(store.getState()).toEqual({ ...initialState, rateOfEthJpy: 0 });
  });

  describe('fetchYamatoState', () => {
    it('fetch Yamato State', () => {
      const newState = {
        lending: { totalCollateral: 10, totalDebt: 5, tvl: 11, tcr: 110 },
        pool: {
          redemptionReserve: 2,
          sweepReserve: 1,
          sweepableCandiate: 0.5,
        },
      };

      store.dispatch(
        fetchYamatoState({ ...newState.lending, ...newState.pool })
      );
      expect(store.getState()).toEqual({
        ...initialState,
        ...newState,
        pool: { ...initialState.pool, ...newState.pool },
      });
    });
  });

  describe('fetchTokenState', () => {
    it('fetch Token State', () => {
      const newState = {
        token: {
          cjpy: { totalSupply: 1000 },
          ymt: { totalSupply: 100 },
          veYmt: { totalSupply: 10, boostRate: 1.5 },
        },
      };

      store.dispatch(fetchTokenState(newState.token));

      (newState.token.veYmt as any).farmingScore =
        initialState.lending.totalDebt * newState.token.veYmt.boostRate;
      expect(store.getState()).toEqual({ ...initialState, ...newState });
    });
  });

  describe('fetchRateOfEthJpy', () => {
    it('fetch Rate Of EthJpy', () => {
      store.dispatch(fetchRateOfEthJpy({ rateOfEthJpy: 10 }));
      expect(store.getState()).toEqual({
        ...initialState,
        rateOfEthJpy: 10,
        prevRateOfEthJpy: 0,
      });
    });
  });

  describe('fetchEvents', () => {
    it('fetch Events', () => {
      const events = [{ id: '1' }, { id: '2' }] as LogEvent[];
      store.dispatch(fetchEvents({ events }));
      expect(store.getState()).toEqual({ ...initialState, events });
    });
  });
});
