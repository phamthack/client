// @flow
import * as React from 'react'
import {Avatar, Box2, Divider, Icon, ConnectedUsernames, Markdown, NameWithIcon} from '../../common-adapters'
import Text, {type TextType} from '../../common-adapters/text'
import {globalColors, globalMargins, styleSheetCreate} from '../../styles'
import {formatTimeForStellarTransaction} from '../../util/timestamp'
import Transaction, {CounterpartyIcon, CounterpartyText, Timestamp} from '../transaction'

type Role = 'sender' | 'receiver'
type CounterpartyType = 'keybaseUser' | 'stellarPublicKey' | 'wallet'

export type Props = {|
  amountUser: string,
  amountXLM: string,
  counterparty: string,
  counterpartyMeta?: string,
  counterpartyType: CounterpartyType,
  // Ignored if yourRole is receiver and counterpartyType is
  // stellarPublicKey.
  memo: string,
  publicMemo?: string,
  // A null timestamp means the transaction is still pending.
  timestamp: Date | null,
  yourRole: Role,
|}

type CounterpartyProps = {|
  counterparty: string,
  counterpartyMeta?: string,
  counterpartyType: CounterpartyType,
  isYou: boolean,
  you: string,
  yourRole: Role,
|}

const Counterparty = (props: CounterpartyProps) =>
  props.isYou ? (
    <NameWithIcon colorFollowing={true} horizontal={true} username={props.you} metaOne="You" />
  ) : props.counterpartyType === 'keybaseUser' ? (
    <NameWithIcon
      colorFollowing={true}
      horizontal={true}
      username={props.counterparty}
      metaOne={props.counterpartyMeta}
    />
  ) : (
    <Box2 direction="horizontal" fullHeight={true}>
      <CounterpartyIcon counterparty={props.counterparty} counterpartyType={props.counterpartyType} />
      <Box2
        direction="vertical"
        fullWidth={true}
        style={{justifyContent: 'center', marginLeft: globalMargins.small}}
      >
        <CounterpartyText
          counterparty={props.counterparty}
          counterpartyType={props.counterpartyType}
          large={true}
          showFullKey={true}
          textType="BodySemibold"
        />
      </Box2>
    </Box2>
  )

const TransactionDetails = (props: Props) => (
  <Box2 direction="vertical" gap="small" fullWidth={true} style={styles.container}>
    <Transaction {...props} large={true} />
    <Divider />

    <Box2 direction="vertical" gap="xtiny" fullWidth={true}>
      <Text type="BodySmallSemibold">Sender:</Text>
      <Counterparty
        counterparty={props.counterparty}
        counterpartyMeta={props.counterpartyMeta}
        counterpartyType={props.counterpartyType}
        isYou={props.yourRole === 'sender'}
        you={props.you}
        yourRole={props.yourRole}
      />
    </Box2>

    <Box2 direction="vertical" gap="xxtiny" fullWidth={true}>
      <Text type="BodySmallSemibold">Recipient:</Text>
      <Counterparty
        counterparty={props.counterparty}
        counterpartyMeta={props.counterpartyMeta}
        counterpartyType={props.counterpartyType}
        isYou={props.yourRole === 'receiver'}
        you={props.you}
        yourRole={props.yourRole}
      />
    </Box2>

    <Box2 direction="vertical" gap="xxtiny" fullWidth={true}>
      <Text type="BodySmallSemibold">Status:</Text>
      <Box2 direction="horizontal" fullHeight={true} fullWidth={true} style={{alignItems: 'center'}}>
        <Icon
          color={props.timestamp ? globalColors.green2 : globalColors.black}
          size="16"
          type={props.timestamp ? 'iconfont-success' : 'icon-transaction-pending-16'}
        />
        <Text
          style={{
            color: props.timestamp ? globalColors.green2 : globalColors.black,
            marginLeft: globalMargins.xtiny,
          }}
          type="Body"
        >
          {props.timestamp ? 'Sent' : 'Pending'}
        </Text>
      </Box2>
      <Timestamp relative={false} timestamp={props.timestamp} />
    </Box2>

    <Box2 direction="vertical" gap="xxtiny" fullWidth={true}>
      <Text type="BodySmallSemibold">Public memo:</Text>
      <Text type="Body">{props.publicMemo}</Text>
    </Box2>

    <Box2 direction="vertical" gap="xxtiny" fullWidth={true}>
      <Text type="BodySmallSemibold">Transaction ID:</Text>
      <Text type="Body">{props.transactionID}</Text>
    </Box2>

    <Text type="BodySmallPrimaryLink">View transaction</Text>
  </Box2>
)

const styles = styleSheetCreate({
  container: {
    padding: globalMargins.small,
  },
  rightContainer: {
    flex: 1,
    marginLeft: globalMargins.tiny,
  },
})

export default TransactionDetails
