import React from 'react'
import Badge from '../common/Badge'
import { TRIP_STATUS, TRIP_STATUS_LABELS } from '../../utils/constants'
const STATUS_TYPE = { planned:'info', ongoing:'success', completed:'neutral', cancelled:'danger' }
const STATUS_ICONS = { planned:'📅', ongoing:'✈️', completed:'✅', cancelled:'❌' }
const StatusBadge = ({ status }) => (
  <Badge type={STATUS_TYPE[status]||'neutral'}>{STATUS_ICONS[status]} {TRIP_STATUS_LABELS[status]||status}</Badge>
)
export default StatusBadge
