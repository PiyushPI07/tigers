export const TRANSFORMER_ADDR = '0xb41C2115ee5481ce9036Bcf69eb8fB75Bb7e74EF'
// export const TRANSFORMER_ADDR = '0x63752ca5B3e794D5cceebE5c88bfb7B476fcad4f'
// export const TRANSFORMER_ADDR = '0xbf13Ae3693F373D98F05A6d3Dd652A284f3d931d'

export const TRANSFORMER_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Nft2DTo3D",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Nft3DTo2D",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "onERC721Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nft2DAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_nft3DAddress",
				"type": "address"
			}
		],
		"name": "setContracts",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]