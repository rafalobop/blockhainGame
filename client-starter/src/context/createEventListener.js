import { ethers } from "ethers";
import { ABI } from "../contract";

const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter) // to not have multiple listeners for the same event

    provider.on(eventFilter, (Logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(Logs)
        cb(parsedLog)
    })
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData}) => {
    const NewPlayerEventFilter = contract.filters.newPlayer()

    AddNewEvent(NewPlayerEventFilter, provider, ({args}) => {
        console.log('New Player Created !', args)

        if(walletAddress === args.owner){
            setShowAlert({
                status: true,
                type: 'success',
                message: 'Player has been created successfully.'
            })
        }
    })

    const NewBattleEventFilter = contract.filters.NewBattle()

    AddNewEvent(NewBattleEventFilter, provider, ({args}) => {
        console.log('New Battle started !', args, walletAddress)

        if(walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()){
            navigate(`/battle/${args.battleName}`)
        }

        setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1)
    })
}