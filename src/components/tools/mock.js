let cal = {
  product: {

  },
  zone: [
    {
      currency_symbol: '$',
      exchange_rate: 4.77,
      name: 'AU',
      price_air: '1',
      price_air_em: '0.5',
      price_sea: '1'
    },
    {
      currency_symbol: '￡',
      exchange_rate: 2.77,
      name: 'UK',
      price_air: '1',
      price_air_em: '0.5',
      price_sea: '1'
    }
  ],
  factor: {
    weight_1: 6000,
    weight_2: 7000,
    sell_cost: 0.18
  },
  domestic: {
    au: [
      {
        start_weight: '0',
        end_weight: '0.396',
        price_unit: '3',
        price_weight: '',
        extra_charge: '0'
      },
      {
        start_weight: '0.396',
        end_weight: '0.425',
        price_unit: '',
        price_weight: '5.758',
        extra_charge: '1'
      },
      {
        start_weight: '0.425',
        end_weight: '0.8',
        price_unit: '',
        price_weight: '5.4',
        extra_charge: '5'
      }
    ],
    uk: [
      {
        start_weight: '0',
        end_weight: '0.396',
        price_unit: '3',
        price_weight: '',
        extra_charge: '1'
      },
      {
        start_weight: '0.396',
        end_weight: '0.425',
        price_unit: '',
        price_weight: '5.758',
        extra_charge: '12'
      },
      {
        start_weight: '0.425',
        end_weight: '0.8',
        price_unit: '',
        price_weight: '5.4',
        extra_charge: '15'
      }
    ]
  },
  local: {
    au: [
      {
        start_weight: '0',
        end_weight: '0.396',
        price_unit: '3',
        price_weight: '',
        extra_charge: '0'
      },
      {
        start_weight: '0.396',
        end_weight: '0.425',
        price_unit: '',
        price_weight: '5.758',
        extra_charge: '1'
      },
      {
        start_weight: '0.425',
        end_weight: '0.8',
        price_unit: '',
        price_weight: '5.4',
        extra_charge: '5'
      }
    ],
    uk: [
      {
        start_weight: '0',
        end_weight: '0.396',
        price_unit: '3',
        price_weight: '',
        extra_charge: '1'
      },
      {
        start_weight: '0.396',
        end_weight: '0.425',
        price_unit: '',
        price_weight: '5.758',
        extra_charge: '12'
      },
      {
        start_weight: '0.425',
        end_weight: '0.8',
        price_unit: '',
        price_weight: '5.4',
        extra_charge: '15'
      }
    ]
  }
}

let user = [
  {
    role: '管理员',
    username: 'admin',
    permission: '全部',
    last_login_time: '2018.11.13 12:49:50',
    login_count: 2
  },
  {
    role: '主管',
    username: 'xs001',
    permission: '计算、查询、商品信息、地区信息（仅查看）',
    last_login_time: '2018.01.31 12:49:50',
    login_count: 1
  },
  {
    role: '专员',
    username: 'xs002',
    permission: '计算、查询（隐藏采购成本)',
    last_login_time: '2018.11.04 12:49:50',
    login_count: 3
  },
  {
    role: '物流',
    username: 'w1001',
    permission: '地区信息、公式系数、国内小包、当地配送',
    last_login_time: '2018.12.03 12:49:50',
    login_count: 5
  }
]
export default {
  cal,
  user
}
