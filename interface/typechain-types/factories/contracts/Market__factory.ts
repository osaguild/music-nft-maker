/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Market, MarketInterface } from "../../contracts/Market";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "CloseSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "Purchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
    ],
    name: "StartSale",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
    ],
    name: "closeSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "saleId",
        type: "uint256",
      },
    ],
    name: "sale",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startBlockNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endBlockNumber",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isSold",
            type: "bool",
          },
        ],
        internalType: "struct IMarket.Sale",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fanficToken",
        type: "address",
      },
    ],
    name: "setFanficToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "protocol",
        type: "address",
      },
    ],
    name: "setProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "startSale",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001b9938038062001b998339818101604052810190620000379190620001a5565b620000576200004b6200006f60201b60201c565b6200007760201b60201c565b62000068816200007760201b60201c565b50620001d7565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200016d8262000140565b9050919050565b6200017f8162000160565b81146200018b57600080fd5b50565b6000815190506200019f8162000174565b92915050565b600060208284031215620001be57620001bd6200013b565b5b6000620001ce848285016200018e565b91505092915050565b6119b280620001e76000396000f3fe6080604052600436106100915760003560e01c806396032702116100595780639603270214610155578063a4223d5314610192578063efef39a1146101bb578063f2fde38b146101d7578063f4f3122e1461020057610091565b80630a9d793d1461009657806318160ddd146100bf578063715018a6146100ea578063765e4548146101015780638da5cb5b1461012a575b600080fd5b3480156100a257600080fd5b506100bd60048036038101906100b89190611363565b61023d565b005b3480156100cb57600080fd5b506100d4610289565b6040516100e191906113a9565b60405180910390f35b3480156100f657600080fd5b506100ff61029a565b005b34801561010d57600080fd5b5061012860048036038101906101239190611363565b6102ae565b005b34801561013657600080fd5b5061013f6102fa565b60405161014c91906113d3565b60405180910390f35b34801561016157600080fd5b5061017c6004803603810190610177919061141a565b610323565b60405161018991906114fb565b60405180910390f35b34801561019e57600080fd5b506101b960048036038101906101b4919061141a565b6103e9565b005b6101d560048036038101906101d0919061141a565b6106f4565b005b3480156101e357600080fd5b506101fe60048036038101906101f99190611363565b610b62565b005b34801561020c57600080fd5b5061022760048036038101906102229190611516565b610be6565b60405161023491906113a9565b60405180910390f35b610245610fe0565b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000610295600161105e565b905090565b6102a2610fe0565b6102ac600061106c565b565b6102b6610fe0565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b61032b6112b2565b600460008381526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820160009054906101000a900460ff1615151515815250509050919050565b6000600460008381526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820160009054906101000a900460ff16151515158152505090506104ac611130565b73ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e83600001516040518263ffffffff1660e01b815260040161052191906113a9565b60206040518083038186803b15801561053957600080fd5b505afa15801561054d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610571919061156b565b73ffffffffffffffffffffffffffffffffffffffff16146105c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105be906115f5565b60405180910390fd5b600081608001511461060e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060590611661565b60405180910390fd5b438160800181815250508060046000848152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a08201518160050160006101000a81548160ff0219169083151502179055509050508060000151827ff1d7fc3941f17b182b7edb26b560ef73862b1e7ed95d281f24d966fdc410f11860405160405180910390a35050565b6000600460008381526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820160009054906101000a900460ff1615151515815250509050348160200151146107f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ec906116cd565b60405180910390fd5b600081608001511461083c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083390611661565b60405180910390fd5b610844611130565b816040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250504381608001818152505060018160a00190151590811515815250508060046000848152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a08201518160050160006101000a81548160ff021916908315150217905550905050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b6b6dd8f34846040518363ffffffff1660e01b815260040161099891906113a9565b6000604051808303818588803b1580156109b157600080fd5b505af11580156109c5573d6000803e3d6000fd5b5050505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e84600001516040518263ffffffff1660e01b8152600401610a6791906113a9565b60206040518083038186803b158015610a7f57600080fd5b505afa158015610a93573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ab7919061156b565b610abf611130565b84600001516040518463ffffffff1660e01b8152600401610ae2939291906116ed565b600060405180830381600087803b158015610afc57600080fd5b505af1158015610b10573d6000803e3d6000fd5b505050508060000151827f103a2bf6ac3bab7477821385d5b123bc7857db160c09eb7f46aef30ea470955b8360200151610b48611130565b604051610b56929190611724565b60405180910390a35050565b610b6a610fe0565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610bda576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bd1906117bf565b60405180910390fd5b610be38161106c565b50565b600080610bf284611138565b9050610bfc611130565b73ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e866040518263ffffffff1660e01b8152600401610c6d91906113a9565b60206040518083038186803b158015610c8557600080fd5b505afa158015610c99573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cbd919061156b565b73ffffffffffffffffffffffffffffffffffffffff1614610d13576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0a906115f5565b60405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663081812fc866040518263ffffffff1660e01b8152600401610d8591906113a9565b60206040518083038186803b158015610d9d57600080fd5b505afa158015610db1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dd5919061156b565b73ffffffffffffffffffffffffffffffffffffffff1614610e2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e229061182b565b60405180910390fd5b600081600001511480610e4357506000816080015114155b610e82576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e7990611897565b60405180910390fd5b610e8c600161129c565b6040518060c00160405280858152602001848152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001438152602001600081526020016000151581525060046000610ee2600161105e565b8152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004015560a08201518160050160006101000a81548160ff02191690831515021790555090505083610f8d600161105e565b7f803dd8e8b56f7b2c3b46eaca49d78615034423031fcf57260d8766c3f5c6501985610fb7611130565b604051610fc5929190611724565b60405180910390a3610fd7600161105e565b91505092915050565b610fe8611130565b73ffffffffffffffffffffffffffffffffffffffff166110066102fa565b73ffffffffffffffffffffffffffffffffffffffff161461105c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161105390611903565b60405180910390fd5b565b600081600001549050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6111406112b2565b600061114c600161105e565b90505b600081111561124857826004600083815260200190815260200160002060000154141561123557600460008281526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201548152602001600482015481526020016005820160009054906101000a900460ff161515151581525050915050611297565b808061124090611952565b91505061114f565b506040518060c001604052806000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600081526020016000151581525090505b919050565b6001816000016000828254019250508190555050565b6040518060c001604052806000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600081526020016000151581525090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061133082611305565b9050919050565b61134081611325565b811461134b57600080fd5b50565b60008135905061135d81611337565b92915050565b60006020828403121561137957611378611300565b5b60006113878482850161134e565b91505092915050565b6000819050919050565b6113a381611390565b82525050565b60006020820190506113be600083018461139a565b92915050565b6113cd81611325565b82525050565b60006020820190506113e860008301846113c4565b92915050565b6113f781611390565b811461140257600080fd5b50565b600081359050611414816113ee565b92915050565b6000602082840312156114305761142f611300565b5b600061143e84828501611405565b91505092915050565b61145081611390565b82525050565b61145f81611325565b82525050565b60008115159050919050565b61147a81611465565b82525050565b60c0820160008201516114966000850182611447565b5060208201516114a96020850182611447565b5060408201516114bc6040850182611456565b5060608201516114cf6060850182611447565b5060808201516114e26080850182611447565b5060a08201516114f560a0850182611471565b50505050565b600060c0820190506115106000830184611480565b92915050565b6000806040838503121561152d5761152c611300565b5b600061153b85828601611405565b925050602061154c85828601611405565b9150509250929050565b60008151905061156581611337565b92915050565b60006020828403121561158157611580611300565b5b600061158f84828501611556565b91505092915050565b600082825260208201905092915050565b7f4d61726b65743a206e6f74206f776e6572000000000000000000000000000000600082015250565b60006115df601183611598565b91506115ea826115a9565b602082019050919050565b6000602082019050818103600083015261160e816115d2565b9050919050565b7f4d61726b65743a20616c726561647920636c6f73656400000000000000000000600082015250565b600061164b601683611598565b915061165682611615565b602082019050919050565b6000602082019050818103600083015261167a8161163e565b9050919050565b7f4d61726b65743a206e6f74206d61746368207072696365000000000000000000600082015250565b60006116b7601783611598565b91506116c282611681565b602082019050919050565b600060208201905081810360008301526116e6816116aa565b9050919050565b600060608201905061170260008301866113c4565b61170f60208301856113c4565b61171c604083018461139a565b949350505050565b6000604082019050611739600083018561139a565b61174660208301846113c4565b9392505050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006117a9602683611598565b91506117b48261174d565b604082019050919050565b600060208201905081810360008301526117d88161179c565b9050919050565b7f4d61726b65743a206e6f7420617070726f766564000000000000000000000000600082015250565b6000611815601483611598565b9150611820826117df565b602082019050919050565b6000602082019050818103600083015261184481611808565b9050919050565b7f4d61726b65743a20616c7265616479206f6e2073616c65000000000000000000600082015250565b6000611881601783611598565b915061188c8261184b565b602082019050919050565b600060208201905081810360008301526118b081611874565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006118ed602083611598565b91506118f8826118b7565b602082019050919050565b6000602082019050818103600083015261191c816118e0565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061195d82611390565b9150600082141561197157611970611923565b5b60018203905091905056fea2646970667358221220d66ecae0cf0f28c68d25a69b2037a98e7a27091955b5f4c4879d79effbed965264736f6c63430008090033";

type MarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Market__factory extends ContractFactory {
  constructor(...args: MarketConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Market> {
    return super.deploy(owner, overrides || {}) as Promise<Market>;
  }
  override getDeployTransaction(
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(owner, overrides || {});
  }
  override attach(address: string): Market {
    return super.attach(address) as Market;
  }
  override connect(signer: Signer): Market__factory {
    return super.connect(signer) as Market__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MarketInterface {
    return new utils.Interface(_abi) as MarketInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Market {
    return new Contract(address, _abi, signerOrProvider) as Market;
  }
}
