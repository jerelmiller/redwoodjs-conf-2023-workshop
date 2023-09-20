import {
  Laptop2,
  MonitorSpeaker,
  Smartphone,
  LucideProps,
  Speaker,
} from 'lucide-react'

interface DeviceIconProps extends LucideProps {
  deviceType: string | null | undefined
}

const DefaultIcon = MonitorSpeaker

const DeviceIcon = ({ deviceType, ...props }: DeviceIconProps) => {
  if (!deviceType) {
    return <DefaultIcon {...props} />
  }

  switch (deviceType) {
    case 'computer':
      return <Laptop2 {...props} />
    case 'smartphone':
      return <Smartphone {...props} />
    case 'speaker':
      return <Speaker {...props} />
    default:
      return <DefaultIcon {...props} />
  }
}

export default DeviceIcon
