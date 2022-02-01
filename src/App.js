import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { NFT_ABI, NFT_ADDR } from './config/NFT'
import { NFT3D_ABI, NFT3D_ADDR } from './config/NFT3D'
import { TRANSFORMER_ABI, TRANSFORMER_ADDR } from './config/TRANSFORMER'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button, Container } from '@mui/material';
import { Box } from '@mui/system';
import { Grid, Card, CardHeader, CardMedia, CardActions, Typography, IconButton } from '@mui/material';
import { Alert } from '@mui/material';

const setApproval = async (tigerContract, gnosisContract, account) => {
  // try {
    // await tigersContract.methods.approve(TRANSFORMER_ADDR, tokenId).send({"from": account});
    const isApprovedTiger = await tigerContract.methods.isApprovedForAll(account, TRANSFORMER_ADDR).call();
    const isApprovedGnosis = await gnosisContract.methods.isApprovedForAll(account, TRANSFORMER_ADDR).call();
    console.log(isApprovedTiger, isApprovedGnosis);
    if (!isApprovedTiger) {
      await tigerContract.methods.setApprovalForAll(TRANSFORMER_ADDR, true).send({ 'from': account });
      alert("Successfully approved!");
    }
    if (!isApprovedGnosis) {
      await gnosisContract.methods.setApprovalForAll(TRANSFORMER_ADDR, true).send({ 'from': account });
      alert("Successfully approved!");
    }
  // }
  // catch (error) {
  //   console.log(error)
  //   alert(`Could not set approval, ${error.message}`)
  // }
}

const tigerToGnosis = async (tokenId, contract, account) => {
  // try {
    await contract.methods.Nft2DTo3D(tokenId).send({ 'from': account }).then((txnHash) => {
      console.log(txnHash)
      alert("Transformation successful!")
      return <Alert severity='success' onClose={() => { }}>Transformation successful!</Alert>
    });
  // } catch (error) {
  //   console.log(error)
  //   alert("Transformation Failed")
  //   return <Alert severity='error' onClose={() => { }}>Transformation failed</Alert>
  // }
  window.location.reload(false)
}

const gnosisToTiger = async (tokenId, contract, account) => {
  // try {
    await contract.methods.Nft3DTo2D(tokenId).send({ 'from': account })
      .then((txnHash) => {
        console.log(txnHash);
        alert("Transformation successful!")
      });
  // } catch (error) {
  //   console.log(error)
  //   alert("Transformation Failed")
  // }
  window.location.reload(false)
}

const NFTGrid = (props) => {
  console.log(props.wallet)
  return props.wallet ? <Container>
    <Grid
      container
      spacing={3}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {props.wallet.Tigers.map((tokenId) => {
        return <Grid item xs={12} sm={6} md={4}>
          <NFT
            contract={props.tigersContract}
            transformerContract={props.transformerContract}
            type="Tiger"
            tokenId={tokenId}
            key={tokenId}
            account={props.account}
            tigersContract={props.tigersContract}
            gnosisContract={props.gnosisContract}
          ></NFT>
        </Grid>
      })}
      {props.wallet.GnosisTigers.map((tokenId) => {
        return <Grid item xs={4}>
          <NFT
            contract={props.gnosisContract}
            transformerContract={props.transformerContract}
            type="Gnosis"
            tokenId={tokenId}
            key={tokenId}
            account={props.account}
            tigersContract={props.tigersContract}
            gnosisContract={props.gnosisContract}
          ></NFT>
        </Grid>
      })}
    </Grid>
  </Container> : <h1>waiting</h1>
}

const NFT = (props) => {
  const [uri, setUri] = useState()
  const [metadata, setMetadata] = useState()
  useEffect(() => {
    const getTokenMetadata = async () => {
      const uri = await props.contract.methods.tokenURI(props.tokenId).call();
      setUri(uri);
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      const ipfs_uri = `https://ipfs.io/ipfs/${uri.substring(7, )}`
      console.log(ipfs_uri)
      await fetch(ipfs_uri, requestOptions)
        .then(response => response.json())
        .then(result => setMetadata(result))
        .catch(error => console.log('error', error));
    }
    getTokenMetadata();
  }, [uri])
  return metadata ?
    <Card
      variant="outlined"
      sx={{
        background: "#5D8E4D",
        height: 420,
        width: 300,
        boxShadow: 3,
        // border: 2,
        borderRadius: 5,
        // borderColor: '#0D2320',
        '&:hover': {
          backgroundColor: '#75A791',
          // opacity: [0.9, 0.8, 0.9],
        },
      }}>
      <CardHeader title={`#${props.tokenId}`}></CardHeader>
      <CardMedia
        component="img"
        height="300"
        image={`https://ipfs.io/ipfs/${metadata.image.substring(7, )}`}
        alt={`xDaiTigers #${props.tokenId}`}
        loading='lazy'
      />
      <CardActions sx={{justifyContent: 'center'}} disableSpacing>
        <Button sx={{ background: "#0D2320" }} variant="contained" size='small' onClick={async () => {
          try {
            await setApproval(props.tigersContract, props.gnosisContract, props.account)
            props.type == "Tiger" ? tigerToGnosis(props.tokenId, props.transformerContract, props.account) : gnosisToTiger(props.tokenId, props.transformerContract, props.account)
          } catch (error) {
            alert(`Transformation failure, ${error.message}`)
          }
        }}>Transform</Button>
      </CardActions>
    </Card>
    : <h3>Loading NFT</h3>
}
function App() {
  const [account, setAccount] = useState(); // state variable to set account.
  const [NFT2D, setNFT2D] = useState();
  const [NFT3D, setNFT3D] = useState();
  const [TRANSFORMER, setTRANSFORMER] = useState();
  const [userWallet, setUserWallet] = useState();

  
  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }

    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();

      setAccount(accounts[0]);

      const NFT2D = new web3.eth.Contract(NFT_ABI, NFT_ADDR);
      const NFT3D = new web3.eth.Contract(NFT3D_ABI, NFT3D_ADDR);
      const TRANSFORMER = new web3.eth.Contract(TRANSFORMER_ABI, TRANSFORMER_ADDR);
      
      setNFT2D(NFT2D);
      setNFT3D(NFT3D);
      setTRANSFORMER(TRANSFORMER);
      const userWallet = {
        Tigers: await NFT2D.methods.walletOfOwner(account).call(),
        GnosisTigers: await NFT3D.methods.walletOfOwner(account).call()
      }
      setUserWallet(userWallet);
      
    }
    load();
  }, [account]);

  return (
    <Box sx={{
      // background: "#001428"
    }}>
      <Box id='appBar'>
        <AppBar position="static" sx={{ background: "#0D2320", boxShadow: 5 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              xDaiTigers
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{
          mt: "20px"
        }}>
          <NFTGrid
            wallet={userWallet}
            tigersContract={NFT2D}
            gnosisContract={NFT3D}
            account={account}
            transformerContract={TRANSFORMER}
          ></NFTGrid>
        </Container>
      </Box>
    </Box >
  );
}

export default App;