export const getStatusObj = Object.freeze({
  '01': '待审核',
  '02': '待验收',
  '03': '验收通过',
  '04': '审核拒绝',
  '05': '验收拒绝'
})
export const getStatusList = [
  {name: '待审核', value: "01", color: ''},
  {name: '待验收', value: "02", color: 'warning'},
  {name: '验收通过', value: "03", color: 'success'},
  {name: '审核拒绝', value: "04", color: 'info'},
  {name: '验收拒绝', value: "05", color: 'danger'}
]
