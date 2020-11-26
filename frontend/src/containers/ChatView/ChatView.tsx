import { useRosterState, Roster, RosterHeader, RosterGroup,   Textarea, PrimaryButton, ChatBubbleContainer, ChatBubble, PopOverItem } from "amazon-chime-sdk-component-library-react";
import { useNavigation } from "../../providers/NavigationProvider";
import React, { useState } from "react";
import { useRealitimeSubscribeChatState } from "../../providers/RealtimeSubscribeChatProvider";

export interface ChatProps {
  attendeeId: string;
  text: string
}
const bubbleStyles = `
  margin: 1rem;
`;

const ChatView = () => {
  const { roster } = useRosterState();
  const { setNaviShowTarget } = useNavigation();
  const { chatData, sendChatData } = useRealitimeSubscribeChatState()
  const [ chatMessage, setChatMessage] = useState('');
  
  const attendeeItems = []
  for (let c of chatData) {
    const senderName = roster[c.senderId] ? roster[c.senderId].name : "unknwon"
    const uuid = c.uuid
    const text = c.data
    const time = (new Date(c.createdDate)).toLocaleTimeString('ja-JP')

    // attendeeItems.push(
    //   <div key={uuid} style={{margin:"5px", wordWrap:"break-word"}}>
    //     <p style={{color:"green"}}>
    //     {time}  {senderName}
    //     </p>
    //     <p style={{paddingLeft:"5px"}}>
    //       {text}
    //     </p>
    //   </div>
    // )
    const actions = (
      <PopOverItem
        children={<span>save comment</span>}
      />
    );
    
    attendeeItems.push(
      <>
      <ChatBubbleContainer timestamp={time}>
        <ChatBubble
          variant="outgoing"
          senderName="Okada"
          content="Do You Like Broccoli Ice Cream?"
          showTail={false}
          css={bubbleStyles}
        />
      </ChatBubbleContainer>

      <ChatBubbleContainer timestamp={time} actions={actions}>
         <ChatBubble
           variant="incoming"
           senderName="lion"
           content="No, I don't"
           showTail={false}
           css={bubbleStyles}
         />
       </ChatBubbleContainer>
       
      </>

    )
  }

  return (

    <Roster className="roster">
      <RosterHeader title="Chat" onClose={()=>{setNaviShowTarget("NONE")}}>
      </RosterHeader>
      <RosterGroup>{attendeeItems}</RosterGroup>
      <br/>
      <Textarea
        //@ts-ignore
        onChange={e => setChatMessage(e.target.value)}
        value={chatMessage}
        placeholder="input your message"
        type="text"
        label=""
        style={{resize:"vertical",}}
      />
      <PrimaryButton 
        label="send" 
        onClick={e=>{
          setChatMessage("")
          sendChatData(chatMessage)
        }}
      />
    </Roster>
  );
}

export default ChatView
