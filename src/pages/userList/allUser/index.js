import { Table ,Avatar,Input,Space,Button,DatePicker,Card,Layout,Collapse,Switch,Select,
  Col, Form, List, Row, Tag,Modal,Upload,message
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined,LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllUser,getLuckUser,delUserInfo } from '@/services/user.js';






const { TextArea } = Input;

class Index extends React.Component {
  state = {
    data: [],
    pagination: {
      page: 1,
      pagesize: 10,
    },
    loading: false,
    columnKey:'id',
    order:'desc',
    searchText: '',
    searchedColumn: '',
    startMonth:'',
    endMonth:'',
    visible:false,
    selectedData:[],
    uloading:false, 
    imageUrl:'',
    imgData:'',
    inputData:{  
      inputTitle:'',
      inputUrl:'',
    }  
  };
  //搜素条件还原
  handleReset = clearFilters => {
    clearFilters();
    let that=this;
    this.setState({
       searchText: '' ,
       searchedColumn: '',
      },function(){
        that.getData();
      });
  };
  async componentDidMount() {
    const { pagination } = this.state;
    this.getData();
  }
  async getData(){
    let res = await getAllUser( {
      page:this.state.pagination.page,
      pagesize:this.state.pagination.pagesize,
      searchedColumn:this.state.searchedColumn,
      searchText:this.state.searchText,
      order:this.state.columnKey,
      sort:this.state.order,
      start:this.state.startMonth,
      end:this.state.endMonth,
    } );

    this.state.data=null;
    this.setState({
            loading: false,
            data: res.data,
            pagination: {
              page:res.current_page,
              pagesize:res.per_page,
              total: res.total,
            },
          },function(){
            // console.log(this.state.data)
          });
  }


  handleTableChange  (pagination, filters, sorter)  {
    // console.log(pagination, filters, sorter)
    let that=this;
    this.setState({
      pagination:{
        page:pagination.current,
        pagesize:pagination.pageSize,
      },
      columnKey:sorter?sorter.columnKey:'',
      order:sorter?sorter.order:''
    },function(){
      that.getData();
    })

  };


  //搜索
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  //处理搜索
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(selectedKeys)
    let that=this;
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    },function(){
      that.getData();
    });

  };

  //搜素条件还原
  handleReset = clearFilters => {
    clearFilters();
    let that=this;
    this.setState({
       searchText: '' ,
       searchedColumn: '',
      },function(){
        that.getData();
      });
  };
  exportExcel(){
    window.location.href='http://cx.com:8888/william/dhl_luckdraw/public/index.php/api/v1/exportExcel?token='+localStorage.getItem('token')+'&type=all'
  }
  async delHistory(record){
    // console.log(record);
    if(record.id){
      let res = await delUserInfo({id:record.id});
      if(res.error_code=='0'){
        //删除成功
        let idata=[];
        this.state.data.map((v,k)=>{
          if(v.id!=record.id){
            idata.push(v);
          }
        })
        this.setState({
          data:idata
        })
      }
    }
  }
  
  render() {
const columns = [
  // {
  //   title: 'id',
  //   dataIndex: 'id',
  //   key:'id',
  //   width: 100,
  // },
  // {
  //   title: 'weapp_id',
  //   dataIndex: 'weapp_id',
  //   key:'weapp_id',
  //   width: 100,
  // },

  {
    title: 'openid',
    dataIndex: 'openid',
    key:'openid',
    ...this.getColumnSearchProps('openid'),
    width: 100,
  },
  {
    title: '小程序名',
    dataIndex: 'user_name',
    key:'user_name',
    width: 100,
  },
  {
    title: '小程序头像',
    dataIndex: 'header_img',
    key:'header_img',
    width: 100,
    render: (header_img,record) => (
      <>
        <img style={{'width':'100px','height':'100px'}} src={header_img} />
      </>
    )
  },
  {
    title: '邀请人id',
    dataIndex: 'invite_id',
    key:'invite_id',
    ...this.getColumnSearchProps('invite_id'),
    width: 100,
  },
  // {
  //   title: '剩余抽奖次数',
  //   dataIndex: 'draw_times',
  //   key:'draw_times',
  //   width: 100,
  // },
  
  {
    title: 'ip',
    dataIndex: 'ip',
    key:'ip',
        ...this.getColumnSearchProps('ip'),
    width: 100,
  },
  {
    title: 'create_time',
    dataIndex: 'create_time',
    key:'create_time',
    width: 100,
    sorter: true,
  },
  {
    title: '管理',
    dataIndex: 'id',
    key:'id',
    width: 100,
    sorter: true,
    render:(uv,record)=>(
        <><Button type="dashed" size="small" onClick={this.delHistory.bind(this,record)}>删除</Button></>
    ),
  }
  

];

    const { data, pagination, loading } = this.state;
    const { Header, Footer, Sider, Content } = Layout;

    return (
      <>
          {/* <Button onClick={this.exportExcel.bind(this)}>导出excel表</Button> */}
          <Card>
              <Table
                  columns={columns}
                  rowKey='id'
                  dataSource={data}
                  pagination={{
                    current:pagination.page,
                    pageSize:pagination.pagesize,
                    total:pagination.total,
                  }}
                  // scroll={{ x: 2500 }}
                  loading={loading}
                  onChange={this.handleTableChange.bind(this)}
                />
          </Card>
      </>
    );
  }
}
export default Index;

