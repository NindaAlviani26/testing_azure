<% java.util.Map<String, String> envVariables = System.getenv();
  String envHome = envVariables.get("HOST_BACKEND");
  %>
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SIMIAN | Application Management</title>
    <script language="JavaScript" type="text/javascript">
      var txt = " SIMIAN | Application Management";
      var speed = 100;
      var refresh = null;
      function move() {
        document.title = txt;
        txt = txt.substring(1, txt.length) + txt.charAt(0);
        refresh = setTimeout("move()", speed);
      }
      move();
    </script>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="shortcut icon" href="img/logo_mini.png?v=2" />
    <!--link rel="stylesheet" href="./plugins/ace/css/ace.css" /-->
    <!-- Bootstrap 3.3.7 -->
    <link rel="stylesheet" href="./plugins/bootstrap/dist/css/bootstrap.min.css">
    <!-- select2 -->
    <link rel="stylesheet" href="./plugins/select2/dist/css/select2.css">
    <!-- css popup -->
    <link rel="stylesheet" href="./plugins/asteroid/style.css">
    <!-- ANIMATE -->
    <link rel="stylesheet" href="./css/animate.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="./plugins/font-awesome/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="./plugins/ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="./plugins/icomoon/css/iconmoon.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="./css/AdminLTE.css">

    <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="./css/skins/_all-skins.css">
    <!-- Morris chart -->
    <link rel="stylesheet" href="./plugins/morris.js/morris.css">
    <!-- jvectormap -->
    <link rel="stylesheet" href="./plugins/jvectormap/jquery-jvectormap.css">
    <!-- Date Picker -->
    <link rel="stylesheet" href="./plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css">
    <!-- Date Time Picker -->
    <link href="./plugins/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="./plugins/bootstrap-daterangepicker/daterangepicker.css">
    <!-- bootstrap wysihtml5 - text editor -->
    <link rel="stylesheet" href="./plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

    <!-- Google Font -->
    <!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"-->

    <!--link rel="stylesheet" href="./plugins/jqgrid/css/ui.jqgrid.min.css" /-->
    <!--link rel="stylesheet" href="./plugins/ace/css/ace.min.css" /-->
    <!--link rel="stylesheet" type="text/css" media="screen" href="./plugins/jqgrid/css/jquery-ui.css" /-->
    <!--link rel="stylesheet" type="text/css" media="screen" href="./plugins/jqgrid/css/ui.jqgrid.css" /-->
    <link rel="stylesheet" href="plugins/jQuery-Tree-Filter/jquery.treefilter.css">
    <link rel="stylesheet" type="text/css" media="screen" href="./plugins/jqgrid/css/ui.jqgrid-bootstrap.css" />
    <link rel="stylesheet" href="./plugins/datatables.net-bs/css/dataTables.bootstrap.min.css">
    </link>
    <link rel="stylesheet" href="./css/custom.css?v=24">
    <link rel="stylesheet" type="text/css" media="screen"
      href="./plugins/query-builder/query-builder.default.min.css" />
    <!-- <link rel="stylesheet"   href="./css/datatables.css"></link> -->

    <link rel="stylesheet" href="./plugins/jsplumb/css/jsplumb.css?v=1">
    <link rel="stylesheet" href="./plugins/jsplumb/demo/draggableConnectors/cssjsplumb.css">

    <style>
      .cursor-pointer {
        cursor: pointer;
      }

      .sidebar-menu .treeview-menu>li>a {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

      }

      ul.sidebar-menu li>a {
        border-bottom: 1px dashed rgb(67 67 67 / 15%);
      }

      ul.sidebar-menu li>a.this-list-menu-module {
        border-top: 1px dashed rgb(67 67 67 / 15%);
      }

      ul.sidebar-menu li.single_menu {
        position: absolute;
        bottom: 0;
        width: 100%;
        line-height: 20px;
        margin-bottom: 10px;
        background-color: #fff;
      }

      /*   .toggle-icon{
      transform: rotate(90deg);
      -webkit-transition-duration: .2s;
    }*/

      a.back-to-top {
        display: none;
        width: 60px;
        height: 60px;
        text-indent: -9999px;
        position: fixed;
        z-index: 999;
        right: 20px;
        bottom: 20px;
        background: #365897 url("./img/up-arrow.png") no-repeat center 43%;
        -webkit-border-radius: 30px;
        -moz-border-radius: 30px;
        border-radius: 30px;
      }

      .sidebar #loading-image-menu {
        max-width: 270px;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 999;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }

      .sidebar #loading-menu {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        display: block;
        opacity: 0.7;
        background-color: #ffffff;
        z-index: 9999;
        text-align: center;
      }

      #loading-image {
        max-width: 470px;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 999;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }

      #loading {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: fixed;
        display: block;
        opacity: 0.7;
        background-color: #ffffff;
        z-index: 9999;
        text-align: center;
      }

      .modal-backdrop.fade.in {
        z-index: -1000 !important;
      }

      .label-job {
        padding: 3px 6px;
        font-size: 12px;
        border-radius: 5px;
      }

      .thumbnail {
        float: left;
        margin-right: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
        transition: 0.3s;
        width: 75px;
        height: 75px;
        border-radius: 5px;
      }

      .infojob {
        border-radius: 25px;
        position: absolute;
        left: -9px;
        top: -8px;
      }

      .thumbnail-text {
        width: 100%;
        display: block;
        text-align: center;
        font-size: 10px;
        margin-top: 4px;
        font-style: italic;
        font-weight: bolder;
        line-height: 11px;
        white-space: pre;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .thumbnail-description {
        min-height: 40px;
      }

      .thumbnail:hover {
        cursor: pointer;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 1);
      }

      /* The switch - the box around the slider */
      .switch {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 17px;
      }

      /* Hide default HTML checkbox */
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      /* The slider */
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 13px;
        width: 13px;
        left: 4px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }

      input:checked+.slider {
        background-color: #2196F3;
      }

      input:focus+.slider {
        box-shadow: 0 0 1px #2196F3;
      }

      input:checked+.slider:before {
        -webkit-transform: translateX(13px);
        -ms-transform: translateX(13px);
        transform: translateX(13px);
      }

      /* Rounded sliders */
      .slider.round {
        border-radius: 34px;
      }

      .slider.round:before {
        border-radius: 50%;
      }


      .hide {
        display: none;
      }

      [style*="--aspect-ratio"]> :first-child {
        width: 100%;
      }

      [style*="--aspect-ratio"]>img {
        height: auto;
      }

      @supports (--custom:property) {
        [style*="--aspect-ratio"] {
          position: relative;
        }

        [style*="--aspect-ratio"]::before {
          content: "";
          display: block;
          padding-bottom: calc(100% / (var(--aspect-ratio)));
        }

        [style*="--aspect-ratio"]> :first-child {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
        }
      }
    </style>
    <!-- <script src="./config.js?v=20"></script> -->
    <script>
      var serverHost = "<%= envHome %>";
    </script>

  </head>

  <body class="hold-transition skin-black-light sidebar-mini fixed">

    <div id="loading" class="hide">
      <img id="loading-image" src="./img/loading2.gif" alt="Loading..." />
    </div>

    <div class="wrapper" id="wrapper">

      <header class="main-header" id="main-header">
        <!-- Logo -->

        <a href="#" class="logo this-dashboard">
          <!-- mini logo for sidebar mini 50x50 pixels -->
          <span class="logo-mini"><img src="./img/logo_mini_white.png?v=2" height="38" /></span>
          <!-- logo for regular state and mobile devices -->
          <span class="logo-lg"><img src="./img/logo_white.png?v=2" height="38" /></span>
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <span class="sr-only">Toggle navigation</span>
          </a>
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">

              <!-- User Account: style can be found in dropdown.less -->
              <li class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <img src="./img/avatar.png?v=2" class="user-image" alt="User Image">
                  <span class="hidden-xs name"></span>
                </a>
                <ul class="dropdown-menu">
                  <!-- User image -->
                  <li class="user-header">
                    <img src="./img/avatar.png" class="img-circle" alt="User Image">

                    <p style="margin-top:0;margin-bottom: 0;">
                      <span class="name"></span>
                      <small style="font-size: 11px; opacity: .7;">
                        <i class="fa fa-user"></i> <span class="branch"></span>
                      </small>
                      <small style="font-size: 11px; opacity: .7;">
                        <i class="fa fa-calendar"></i> <span class="todayz"></span>
                      </small>
                      <small style="font-size: 11px; opacity: .7;">
                        <i class="fa fa-clock-o"></i> <span class="lastlogin"></span>
                      </small>
                    </p>
                  </li>
                  <!-- Menu Footer-->

                  <li class="user-footer">
                    <div class="pull-left">
                      <a href="#" class="btn btn-default"
                        onclick="HtmlLoad(serverHost +'addons/base/changepass.api','Change Password');"> <i
                          class="fa fa-lock"></i> Change Password</a>
                    </div>
                    <div class="pull-right">
                      <button class="logout btn btn-default"><i class="fa fa-sign-out"></i> Sign out</button>
                    </div>
                  </li>
                </ul>
              </li>
              <!-- Control Sidebar Toggle Button -->
              <!-- <li>
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
          </li> -->
            </ul>
          </div>
        </nav>
      </header>
      <!-- Left side column. contains the logo and sidebar -->
      <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <!-- <form action="#" method="get" class="sidebar-form"> -->
        <div class="sidebar-form">
          <div class="input-group">
            <input type="text" name="searchmenu" id="searchmenu" class="form-control"
              placeholder="&#xF002; Search menu..."
              style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif,FontAwesome;">
            <span class="input-group-btn">
              <button type="submit" name="close" id="clear-btn" class="btn btn-flat hide"><i
                  class="fa fa-close"></i></button>
              <!-- <button type="submit" name="search" id="search-btn" class="btn btn-flat" style="padding-left:4px"><i class="fa fa-search"></i></button> -->
            </span>
          </div>
        </div>
        <!-- </form> -->
        <!-- /.search form -->
        <!--div class="header" align="center" style="border=1"><font color="#FFFFFF">MAIN NAVIGATION</font></div-->
        <ul class="sidebar-menu" style="font-size: 12px;">
          <li class="header">
            <font><b>Main Menus</b></font><button type="button" class="btn btn-box-tool pull-right-container"
              data-widget="refresh" id="refreshmenu" title="Refresh Menu"><i id="refreshicon"
                class="fa fa-refresh pull-right"></i></button>
          </li>
        </ul>
        <section class="sidebar">
          <div id="loading-menu" class="hide">
            <img id="loading-image-menu" src="./img/loading2.gif" alt="Loading..." />
          </div>
          <!-- search form -->
          <ul class="sidebar-menu" id="sidebarmenu" style="font-size: 12px; font-weight: bold;margin-bottom: 45px;"
            data-widget="tree"></ul>
        </section>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
          <!-- <h1 class="app_name inline"></h1>
      <h1 class="inline"><small class="app_ver"></small></h1> -->
          <ol class="breadcrumb" id="mainNavigate">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Dashboard</li>
          </ol>
        </section>

        <!-- Main content -->
        <section class="content" id="mainContent">
          <section class="row" id="rowContent">

          </section>
        </section>
        <!-- /.content -->
      </div>
      <!-- /.content-wrapper -->
      <footer class="main-footer" id="main-footer" style="font-size: 10px;">
        <div class="app_ver pull-right hidden-xs">

        </div>
        <strong>Copyright &copy; 2020 <a target="_blank" href="https://simian.com">SIMIAN Technologies</a>.</strong> All
        rights reserved.
      </footer>

      <!-- Control Sidebar -->
      <aside class="control-sidebar control-sidebar-dark">
        <!-- Create the tabs -->
        <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
          <li><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
          <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
          <!-- Home tab content -->
          <div class="tab-pane" id="control-sidebar-home-tab">
            <h3 class="control-sidebar-heading">Recent Activity</h3>
            <ul class="control-sidebar-menu">
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-birthday-cake bg-red"></i>

                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>

                    <p>Will be 23 on April 24th</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-user bg-yellow"></i>

                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">Frodo Updated His Profile</h4>

                    <p>New phone +1(800)555-1234</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-envelope-o bg-light-blue"></i>

                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">Nora Joined Mailing List</h4>

                    <p>nora@example.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="menu-icon fa fa-file-code-o bg-green"></i>

                  <div class="menu-info">
                    <h4 class="control-sidebar-subheading">Cron Job 254 Executed</h4>

                    <p>Execution time 5 seconds</p>
                  </div>
                </a>
              </li>
            </ul>
            <!-- /.control-sidebar-menu -->

            <h3 class="control-sidebar-heading">Tasks Progress</h3>
            <ul class="control-sidebar-menu">
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    Custom Template Design
                    <span class="label label-danger pull-right">70%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-danger" style="width: 70%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    Update Resume
                    <span class="label label-success pull-right">95%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-success" style="width: 95%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    Laravel Integration
                    <span class="label label-warning pull-right">50%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-warning" style="width: 50%"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <h4 class="control-sidebar-subheading">
                    Back End Framework
                    <span class="label label-primary pull-right">68%</span>
                  </h4>

                  <div class="progress progress-xxs">
                    <div class="progress-bar progress-bar-primary" style="width: 68%"></div>
                  </div>
                </a>
              </li>
            </ul>
            <!-- /.control-sidebar-menu -->

          </div>
          <!-- /.tab-pane -->
          <!-- Stats tab content -->
          <div class="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
          <!-- /.tab-pane -->
          <!-- Settings tab content -->
          <div class="tab-pane" id="control-sidebar-settings-tab">
            <form method="post">
              <h3 class="control-sidebar-heading">General Settings</h3>

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Report panel usage
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  Some information about this general settings option
                </p>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Allow mail redirect
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  Other sets of options are available
                </p>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Expose author name in posts
                  <input type="checkbox" class="pull-right" checked>
                </label>

                <p>
                  Allow the user to show his name in blog posts
                </p>
              </div>
              <!-- /.form-group -->

              <h3 class="control-sidebar-heading">Chat Settings</h3>

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Show me as online
                  <input type="checkbox" class="pull-right" checked>
                </label>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Turn off notifications
                  <input type="checkbox" class="pull-right">
                </label>
              </div>
              <!-- /.form-group -->

              <div class="form-group">
                <label class="control-sidebar-subheading">
                  Delete chat history
                  <a href="javascript:void(0)" class="text-red pull-right"><i class="fa fa-trash-o"></i></a>
                </label>
              </div>
              <!-- /.form-group -->
            </form>
          </div>
          <!-- /.tab-pane -->
        </div>
      </aside>
      <!-- /.control-sidebar -->
      <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
      <div class="control-sidebar-bg"></div>
    </div>
    <!-- ./wrapper -->

    <!-- jQuery 3 -->
    <script src="./plugins/jquery/dist/jquery.min.js"></script>
    <!--script src="./plugins/jquery/dist/jquery-2.2.3.min.js"></script-->
    <!-- Bootstrap 3.3.7 -->
    <script src="./plugins/bootstrap/dist/js/bootstrap.min.js"></script>

    <!-- lib js popup -->
    <script src="./plugins/asteroid/asteroid-alert.js?v=7"></script>

    <!-- jQuery UI 1.11.4 -->
    <!-- <script src="./plugins/jquery-ui/jquery-ui.min.js"></script> -->
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script>
      $.widget.bridge('uibutton', $.ui.button);
    </script>

    <!-- select2 -->
    <script type="text/javascript" src="./plugins/select2/dist/js/select2.js"></script>

    <!-- Morris.js charts -->
    <script src="./plugins/raphael/raphael.min.js"></script>
    <script src="./plugins/morris.js/morris.min.js"></script>
    <!-- Sparkline -->
    <script src="./plugins/jquery-sparkline/dist/jquery.sparkline.min.js"></script>
    <!-- jvectormap -->
    <script src="plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
    <script src="plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
    <!-- jQuery Knob Chart -->
    <script src="./plugins/jquery-knob/dist/jquery.knob.min.js"></script>
    <!-- daterangepicker -->
    <script src="./plugins/moment/min/moment.min.js"></script>
    <script src="./plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
    <!-- datepicker -->
    <script src="./plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
    <!-- Date Time Picker -->
    <script src="./plugins/datetimepicker/bootstrap-datetimepicker.min.js"></script>
    <!-- Bootstrap WYSIHTML5 -->
    <script src="plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
    <!-- Slimscroll -->
    <script src="./plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    <!-- FastClick -->
    <script src="./plugins/fastclick/lib/fastclick.js"></script>

    <script src="./plugins/tippy/core.js"></script>
    <script src="./plugins/tippy/tippy.js"></script>

    <!-- data tables -->
    <script type="text/javascript" language="javascript"
      src="./plugins/datatables.net/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" language="javascript"
      src="./plugins/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>


    <script>
      var AdminLTEOptions = {
        //Enable sidebar expand on hover effect for sidebar mini
        //This option is forced to true if both the fixed layout and sidebar mini
        //are used together
        sidebarExpandOnHover: true,
        //BoxRefresh Plugin
        enableBoxRefresh: true,
        //Bootstrap.js tooltip
        enableBSToppltip: true,
        //Add slimscroll to navbar menus
        //This requires you to load the slimscroll plugin
        //in every page before app.js
        navbarMenuSlimscroll: true,
        navbarMenuSlimscrollWidth: "40px", //The width of the scroll bar
        navbarMenuHeight: "200px", //The height of the inner menu
        //General animation speed for JS animated elements such as box collapse/expand and
        //sidebar treeview slide up/down. This option accepts an integer as milliseconds,
        //'fast', 'normal', or 'slow'
        animationSpeed: 500,
        //Sidebar push menu toggle button selector
        sidebarToggleSelector: "[data-toggle='offcanvas']",
        //Activate sidebar push menu
        sidebarPushMenu: true,
        //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
        sidebarSlimScroll: true,
        //Enable sidebar expand on hover effect for sidebar mini
        //This option is forced to true if both the fixed layout and sidebar mini
        //are used together
        sidebarExpandOnHover: false,
        //BoxRefresh Plugin
        enableBoxRefresh: true,
        //Bootstrap.js tooltip
        enableBSToppltip: true,
        BSTooltipSelector: "[data-toggle='tooltip']",
        //Enable Fast Click. Fastclick.js creates a more
        //native touch experience with touch devices. If you
        //choose to enable the plugin, make sure you load the script
        //before AdminLTE's app.js
        enableFastclick: true,
        //Control Sidebar Tree Views
        enableControlTreeView: true,
        //Control Sidebar Options
        enableControlSidebar: true,
        controlSidebarOptions: {
          //Which button should trigger the open/close event
          toggleBtnSelector: "[data-toggle='control-sidebar']",
          //The sidebar selector
          selector: ".control-sidebar",
          //Enable slide over content
          slide: true
        },
        //Box Widget Plugin. Enable this plugin
        //to allow boxes to be collapsed and/or removed
        enableBoxWidget: true,
        //Box Widget plugin options
        boxWidgetOptions: {
          boxWidgetIcons: {
            //Collapse icon
            collapse: 'fa-minus',
            //Open icon
            open: 'fa-plus',
            //Remove icon
            remove: 'fa-times'
          },
          boxWidgetSelectors: {
            //Remove button selector
            remove: '[data-widget="remove"]',
            //Collapse button selector
            collapse: '[data-widget="collapse"]'
          }
        },
        //Direct Chat plugin options
        directChat: {
          //Enable direct chat by default
          enable: true,
          //The button to open and close the chat contacts pane
          contactToggleSelector: '[data-widget="chat-pane-toggle"]'
        },
        //Define the set of colors to use globally around the website
        colors: {
          lightBlue: "#3c8dbc",
          red: "#f56954",
          green: "#00a65a",
          aqua: "#00c0ef",
          yellow: "#f39c12",
          blue: "#0073b7",
          navy: "#001F3F",
          teal: "#39CCCC",
          olive: "#3D9970",
          lime: "#01FF70",
          orange: "#FF851B",
          fuchsia: "#F012BE",
          purple: "#8E24AA",
          maroon: "#D81B60",
          black: "#222222",
          gray: "#d2d6de"
        },
        //The standard screen sizes that bootstrap uses.
        //If you change these in the variables.less file, change
        //them here too.
        screenSizes: {
          xs: 480,
          sm: 768,
          md: 992,
          lg: 1200
        }
      }; 
    </script>
    <!-- AdminLTE App -->
    <script src="./js/adminlte.min.js"></script>
    <!-- AdminLTE dashboard demo (This is only for demo purposes) -->
    <script src="./js/demo.js"></script>
    <script src="./plugins/jQuery-Tree-Filter/jquery.treefilter.js"></script>
    <script src="./plugins/jqgrid/js/grid.locale-en1.js"></script>
    <!-- This is the Javascript file of jqGrid -->

    <script src="./plugins/jqgrid/js/jquery.jqGrid.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/tableDnD/jquery.tablednd.js"></script>
    <script type="text/javascript" language="javascript"
      src="./plugins/query-builder/jquery-extendext/jquery-extendext.min.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/interact.min.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/main.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/defaults.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/plugins.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/core.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/public.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/data.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/template.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/utils.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/model.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/adds/jquery.js"></script>
    <script type="text/javascript" language="javascript"
      src="./plugins/query-builder/query-builder.standalone.min.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/sortable/plugin.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/query-builder/sql-parser.min.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/tableExport/js/tableExport.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/typeahead/bootstrap3-typeahead.js"></script>
    <!--script type="text/javascript" language="javascript" src="./plugins/w3/w3.js"></script-->
    <script type="text/javascript" language="javascript" src="./js/resumable.js"></script>
    <!-- plugin excel -->
    <script type="text/javascript" language="javascript" src="./plugins/excel/jszip.min.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/excel/excelexportjs.js"></script>
    <script type="text/javascript" language="javascript" src="./js/mdm.js?v=21"></script>
    <script type="text/javascript" language="javascript" src="./plugins/TableExportExcel/jquery.table2excel.js"></script>
    <script type="text/javascript" language="javascript" src="./js/mdm.js?v=21"></script>

    <!-- <script type="text/javascript"  src="./js/jquery.dataTables.min.js"></script> -->

    <!-- function popup -->
    <script type="text/javascript" language="javascript" src="./js/asteroid.js?v=8"></script>
    <!-- amchart v4 -->
    <script type="text/javascript" language="javascript" src="./plugins/amcharts4/core.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/amcharts4/charts.js"></script>
    <script type="text/javascript" language="javascript" src="./plugins/amcharts4/themes/animated.js"></script>

    <!-- <script src="./js/query-builder.js?v=4"></script> -->

    <!-- support lib for bezier stuff -->
    <script src="./plugins/jsplumb/lib/jsBezier-0.6.js"></script>
    <!-- event adapter -->
    <script src="./plugins/jsplumb/lib/mottle-0.4.js"></script>
    <!-- geometry functions -->
    <script src="./plugins/jsplumb/lib/biltong-0.2.js"></script>
    <!-- drag -->
    <script src="./plugins/jsplumb/lib/katavorio-0.4.js"></script>
    <!-- jsplumb util -->
    <script src="./plugins/jsplumb/src/util.js"></script>
    <script src="./plugins/jsplumb/src/browser-util.js"></script>
    <!-- base DOM adapter -->
    <script src="./plugins/jsplumb/src/dom-adapter.js"></script>
    <!-- main jsplumb engine -->
    <script src="./plugins/jsplumb/src/jsPlumb.js"></script>
    <!-- endpoint -->
    <script src="./plugins/jsplumb/src/endpoint.js"></script>
    <!-- connection -->
    <script src="./plugins/jsplumb/src/connection.js"></script>
    <!-- anchors -->
    <script src="./plugins/jsplumb/src/anchors.js"></script>
    <!-- connectors, endpoint and overlays  -->
    <script src="./plugins/jsplumb/src/defaults.js"></script>
    <!-- bezier connectors -->
    <script src="./plugins/jsplumb/src/connectors-bezier.js"></script>
    <!-- state machine connectors -->
    <script src="./plugins/jsplumb/src/connectors-statemachine.js"></script>
    <!-- flowchart connectors -->
    <script src="./plugins/jsplumb/src/connectors-flowchart.js"></script>
    <script src="./plugins/jsplumb/src/connector-editors.js"></script>
    <!-- SVG renderer -->
    <script src="./plugins/jsplumb/src/renderers-svg.js"></script>


    <!-- vml renderer -->
    <script src="./plugins/jsplumb/src/renderers-vml.js"></script>

    <!-- common adapter -->
    <script src="./plugins/jsplumb/src/base-library-adapter.js"></script>
    <!-- no library jsPlumb adapter -->
    <script src="./plugins/jsplumb/src/dom.jsPlumb.js"></script>

    <!-- JS-Beuatify -->
    <script src="./plugins/js-beautify/js-beautify.js"></script>
    <script src="./plugins/js-beautify/html-beautify.js"></script>
    
    <!-- Sortable js -->
    <script src="./plugins/sortablejs/sortable.js"></script>
    <!-- /JS -->

    <!--  demo code -->
    <script src="demo.js?v=2"></script>

    <script src="../demo-list.js"></script>


    <script type="text/javascript" language="javascript">
      var jsonstr;

      // link ke dashboard



      // console.log(window.location.href);
      var url_href = window.location.href;

      $(".this-dashboard").click(function () {
        var get_url = window.location.pathname;
        var value_url = get_url.split("/");
        value_url = value_url[1];

        var get_search_x = window.location.search;


        $('.this-dashboard').attr("href", "/" + value_url + get_search_x);
      });
      // end link ke dashboard

      function Iterate(data) {
        // console.log(data);
        var i = 0;
        var menus = "";
        jQuery.each(data, function (index, value) {

          // membuat single menu tanpa param
          var thisLinks = value.links;
          var valueLinks = thisLinks.split("/");
          var valueLinks0 = valueLinks.slice(0, valueLinks.length - 1);
          valueLinks0 = valueLinks0.join("/");

          valueLinks = valueLinks.slice(valueLinks.length - 1);
          valueLinks = valueLinks.join("/");
          valueLinks = valueLinks.split("?");
          var valueLinksLength = valueLinks.length;
          var thisValueLinks = valueLinks[0].replace("&", "?");



          if (typeof value == 'object') {
            if (value.parent == '0') {
              $parent = $('<li class="treeview" ><a href="#" title="' + value.menu + '" ><i class="fa ' + value.icon + '"></i><span>' + value.menu + '</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a><ul class="treeview-menu" id="idmenu' + value.idmenus + '"></ul></li>');
              $("#sidebarmenu").append($parent);


            }
            // only link to list menu module (hardcode)
            else if (value.parent == '') {
              $parent = $('<li class="treeview single_menu" ><a href="#" title="' + value.menu + '" class="this-list-menu-module"><i class="fa ' + value.icon + '"></i><span>' + value.menu + '</span></a></li>');
              $("#sidebarmenu").append($parent);


              // link ke list menu module
              $("a.this-list-menu-module").click(function () {
                // window.location.reload();
                window.location.replace("module.jsp");
              });
              // end link ke list menu module
            }
            else {
              if (value.links == '') {
                //alert(value.menu); 
                /*	$child = $('<li><a href="#"><i class="fa '+value.icon+'"></i><span>'+value.menu+'</span></a><ul class="treeview-menu" data-widget="tree" id="idmenu'+value.idmenus+'"></ul></li>');
                */
                $child = $('<li class="treeview" ><a href="#" title="' + value.menu + '"><span>' + value.menu + '</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a><ul class="treeview-menu" id="idmenu' + value.idmenus + '"></ul></li>');

              }
              else {
                if (value.withframe == '1') {
                  $child = $('<li><a href="#" title="' + value.menu + '" onclick="HtmlPush(\'' + value.links + '\',\'' + value.descx + '\');"><i class="fa ' + value.icon + '"></i>' + value.menu + '</a></li>');
                }
                else {
                  if (valueLinksLength != 2) {
                    $child = $('<li><a href="#" title="' + value.menu + '" onclick="HtmlLoad(\'' + valueLinks0 + '/' + thisValueLinks + '\',\'' + value.descx + '\');">' + value.menu + '</a></li>');
                  } else {
                    $child = $('<li><a href="#" title="' + value.menu + '" onclick="HtmlLoad(\'' + value.links + '\',\'' + value.descx + '\');">' + value.menu + '</a></li>');
                  }
                  // $child = $('<li><a href="#" onclick="HtmlLoad(\''+value.links+'\',\''+value.descx+'\');"><i class="fa '+value.icon+'"></i>'+value.menu+'</a></li>');
                }
              }

              $("#idmenu" + value.parent).append($child);

              // console.log($("#idmenu"+value.parent).append($child));
            }
          }
        });
        //$.AdminLTE.tree('.sidebar');

        // i = 1;
        // $('.fa-angle-right').click(function(){
        //   elem = this;

        //   $(elem).animate({rotation: 60*i}, {
        //     duration: 500,
        //     step: function(now) {
        //       $(elem).css({'transform' : 'rotate('+ now +'deg)'});
        //     }
        //   }).toggle();
        //   // i=!i;
        // });

      };



      function HtmlPush(url) {
        alert("2");
        var html = [];
        html.push('<div class="tabIframeWrapper">');
        html.push('<iframe style="--aspect-ratio: 16/9;" frameborder = "0" src="' + url + '">Load Failed?</iframe>');
        html.push('</div>');
        var stringx = '<div class="tabIframeWrapper"><iframe class="iframetab" frameborder = "0" src="' + url + '">Load Failed?</iframe></div>';
        var tinggi = window.innerHeight - ($("#main-header").innerHeight() + $("#main-footer").innerHeight());
        $("#mainContent").empty();
        $("#mainContent").html(stringx);
        $("#mainContent").find("iframe").height($("#mainContent").innerHeight() - 20);
        $("#mainContent").find("iframe").width('100%');
        //alert($("#content-wrapper").innerHeight());
      }

      function HtmlPush(url, title, navigate) {

        var html = [];

        html.push('<div class="tabIframeWrapper">');
        html.push('<iframe class="iframetab" frameborder = "0" src="' + url + '">Load Failed?</iframe>');
        html.push('</div>');
        var stringx = '<div class="box box-default box-success"><div class="box-header with-border"><h3 class="box-title">' + title + '</h3></div><div class="box-body"><iframe class="iframetab" style="bottom:0;top:0;left:0;right:0;margin-top:0px;margin-bottom:0px;margin-right:0px;margin-left:0px;" frameborder = "0" src="' + url + '">Load Failed?</iframe></div></div>';
        var tinggi = window.innerHeight - ($("#main-header").innerHeight() + $("#main-footer").innerHeight());
        //alert(tinggi);
        $("#mainTitle").val(title);
        $("#mainNavigate").val(navigate);

        $("#mainContent").empty();
        $("#mainContent").html(stringx);
        $("#mainContent").find("iframe").height(tinggi);
        $("#mainContent").find("iframe").width('100%');
      }

      function HtmlLoad(url, title, navigate) {
        $("#mainTitle").val(title);
        $("#mainNavigate").val(navigate);
        $("#mainContent").empty();
        $("#mainContent").load(url);
      }

      var saveETLJobs = function () { return false; };
      var checkingBatchStatus = null;
      var checkingLog = null;

      function HtmlLoad(url, menux) {

        document.removeEventListener("keydown", saveETLJobs);
        clearInterval(checkingBatchStatus);
        clearInterval(checkingLog);

        var linksx = '<li><a href="' + url_href + '"><i class="fa fa-dashboard"></i> Home</a> &#187; ' + menux + '</li>';
        // alert(linksx);
        if (typeof ws !== 'undefined') { ws.close(); }
        if (typeof $('.ui-jqdialog') !== 'undefined') {
          $('body').children('.ui-jqdialog').remove();
        }
        $("#mainNavigate").html(linksx);
        $("#mainContent").empty();

        // var jsScript = url.replace(serverHost, "");
        // jsScript = jsScript.replace(".api", ".js");
        // jsScript = jsScript.split("?")[0];

        var jsScript = url.split("/");
        jsScript = jsScript.slice(4);
        jsScript = jsScript.join('/');
        jsScript = jsScript.replace(".api", ".js");
        jsScript = jsScript.split("?")[0];


        $.getScript("./" + jsScript, function (data, textStatus, jqxhr) {
          // $.getScript(jsScript, function( data, textStatus, jqxhr ) {
          getForm(url);

        });

        $("#navTitle").html(menux);
      }


      function HtmlLoadJs(url, menux, dataset) {
        var linksx = '<li><a href="' + url_href + '"><i class="fa fa-dashboard"></i> Home</a> &#187; ' + menux + '</li>';
        // alert(linksx);
        if (typeof ws !== 'undefined') { ws.close(); }
        if (typeof $('.ui-jqdialog') !== 'undefined') {
          $('body').children('.ui-jqdialog').remove();
        }
        $("#mainNavigate").html(linksx);
        $("#mainContent").empty();


        $.getScript("./" + url, function (data, textStatus, jqxhr) {
          getForm(url, dataset);

        });

        $("#navTitle").html(menux);
      }


      function HtmlLoadJsTopic(url, menux, dataset1, dataset2) {
        var linksx = '<li><a href="' + url_href + '"><i class="fa fa-dashboard"></i> Home</a> &#187; ' + menux + '</li>';
        // alert(linksx);
        if (typeof ws !== 'undefined') { ws.close(); }
        if (typeof $('.ui-jqdialog') !== 'undefined') {
          $('body').children('.ui-jqdialog').remove();
        }
        $("#mainNavigate").html(linksx);
        $("#mainContent").empty();


        $.getScript("./" + url, function (data, textStatus, jqxhr) {
          getForm(url, dataset1, dataset2);

        });

        $("#navTitle").html(menux);
      }


      $(document).ready(function () {


      });

      $('#refreshmenu').on("click", function () {
        $('#sidebarmenu').find('.treeview').empty();
        //$('#refreshicon').attr('class','fa fa-spinner'); 

        //loading menu
        $("#loading-menu").removeClass('hide');

        $.ajax({
          beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
          method: "POST",
          dataType: "json",
          url: serverHost + "addons/base/loadmenu.api",
          success: function (msg) {
            jsonstr = msg;


            // Iterate(JSON.parse(msg.data));

            //hide loading refresh menu
            $("#loading-menu").addClass('hide');
            // $("#loading").addClass('hide');
            $.ajax({
              beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
              url: serverHost + "addons/base/getattrindex.api",
              dataType: "json",
              method: "POST",
              success: function (message) {
                if (msg.status == 'success') {

                  // $("#loading").addClass('hide');
                  if (message.attribute.firstLogin == '1') {
                    HtmlLoad(serverHost + 'addons/base/changepass.api', 'Change Password');

                  } else {
                    // get param url
                    var id_module_param = '';
                    var get_search = window.location.search;
                    get_search = get_search.split("=");
                    id_module_param = get_search[1];



                    var value_result = [];
                    // loop value menu detail from ajax loadmenu
                    var menu_single = { child: "0", descx: "List Module", icon: "fa-list", idmenus: "333", idmodule: "333", links: "", menu: "List Module", parent: "", withframe: "1" };
                    var y = 0;
                    jQuery.each(JSON.parse(msg.data), function (index, value) {
                      if (value.idmodule == id_module_param) {
                        value_result[y] = value;
                      }
                      y++;
                    });
                    value_result.push(menu_single);
                    var value_result_x = value_result.filter(function (l) { return l !== '' });



                    // Iterate(JSON.parse(msg.data));
                    Iterate(value_result_x);
                  }
                }
              },
              error: function (err) {
                console.log(err);
              }
            });
          }
        });


      }
      );


      $('body').prepend('<a href="#" class="back-to-top">Back to Top</a>');
      var amountScrolled = 300;

      $(window).scroll(function () {
        if ($(window).scrollTop() > amountScrolled) {
          $('a.back-to-top').fadeIn('slow');
        } else {
          $('a.back-to-top').fadeOut('slow');
        }
      });

      var tree = new treefilter($("#sidebarmenu"), {
        searcher: $("input#searchmenu"),
        expanded: true,
        offsetLeft: 20,
        multiselect: true
      });
      var readyNow = 0;

      // clear search sidebar
      $("input#searchmenu").keypress(function () {
        $('#clear-btn').removeClass('hide');
        $('#clear-btn').on('click', function () {
          $("input#searchmenu").val('');
          $('li').removeClass('tf-search-result');
          $('ul').removeClass('tf-search-result');
          $('#clear-btn').addClass('hide');
        });
      });
      // end clear search sidebar

      $("#loading").removeClass('hide');
      // $("#mainContent").load("./addons/ob/dashboard.html"); 

      var IDLE_TIMEOUT = 1000; //seconds
      var _idleSecondsCounter = 0;
      document.onclick = function () {
        _idleSecondsCounter = 0;
      };
      document.onmousemove = function () {
        _idleSecondsCounter = 0;
      };
      document.onkeypress = function () {
        _idleSecondsCounter = 0;
      };
      window.setInterval(CheckIdleTime, IDLE_TIMEOUT);

      function CheckIdleTime() {
        _idleSecondsCounter++;
        var oPanel = document.getElementById("SecondsUntilExpire");
        if (oPanel)
          oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";
        if (_idleSecondsCounter >= IDLE_TIMEOUT) {
          //alert("Time expired!");
          // document.location.href ="./logout.php";

          // sessionStorage.clear();
          // window.location.replace("login.jsp");
          $.ajax({
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
            url: serverHost + "logout.api",
            method: "GET",
            success: function (result) {
              sessionStorage.clear();
              location.replace('./login.jsp');
            },
            error: function (err) {
              console.log(err);
            }
          });

          /*
          $.ajax({
            method: "POST",
            url: "./logout.php",
            timeout: 3000,
            success: function( msg ) { 
            alert("" + msg);
            }
          })  ; 
          */
        }
      }

      $(window).on("unload", function (e) {
        /*
        $.ajax({
            method: "POST",
            url: "./logout.php",
            timeout: 3000,
            success: function( msg ) { 
            alert("" + msg);
            }
          })  ;  
        */

        console.log("this will be triggered");
      });
      window.onbeforeunload = function (e) {
        // Your logic to prepare for 'Stay on this Page' goes here 
        console.log("Are you sure leave from this page ?");
        //return "Are you sure leave from this page ?";
      };


      $(".logout").on("click", function () {
        // sessionStorage.clear();
        // window.location.replace("login.jsp");
        // window.location.replace(serverHost+"logout.api");
        $.ajax({
          beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
          url: serverHost + "logout.api",
          method: "GET",
          success: function (result) {
            sessionStorage.clear();
            location.replace('./login.jsp');
          },
          error: function (err) {
            console.log(err);
          }
        });

      });


      if (sessionStorage.token == null) {

        window.location.replace("login.jsp");
        // $.ajax({
        //   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        //   url : serverHost + "logout.api",
        //   method : "GET",
        //   success : function(result){
        //     // sessionStorage.clear();
        //     location.replace('./login.jsp');
        //   },
        //   error : function(err){
        //     console.log(err);
        //   }
        // });
      } else {
        //init
        $.ajax({
          beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
          url: serverHost + "addons/base/loadmenu.api",
          dataType: "json",
          method: "POST",
          success: function (msg) {
            if (msg.status == 'success') {
              sessionStorage.setItem("token", msg.token.refresh);
              $.ajax({
                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                url: serverHost + "addons/base/getattrindex.api",
                dataType: "json",
                method: "POST",
                success: function (message) {
                  if (msg.status == 'success') {

                    $(".app_name").html(message.attribute.app_name);
                    $(".app_ver").html(message.attribute.app_ver);
                    $(".lastlogin").html(message.attribute.lastlogin);
                    $(".name").html(message.attribute.name);
                    $(".todayz").html(message.attribute.todayz);
                    $(".branch").html('Branch: ' + message.attribute.branch);

                    if (message.attribute.firstLogin == '1') {
                      HtmlLoad(serverHost + 'addons/base/changepass.api', 'Change Password');

                    } else {

                      // get param url
                      var id_module_param = '';
                      var get_search = window.location.search;
                      get_search = get_search.split("=");
                      id_module_param = get_search[1];

                      var value_result = [];
                      // loop value menu detail from ajax loadmenu
                      var menu_single = { child: "0", descx: "List Module", icon: "fa-list", idmenus: "333", idmodule: "333", links: "", menu: "List Module", parent: "", withframe: "1" };
                      var y = 0;
                      jQuery.each(JSON.parse(msg.data), function (index, value) {
                        if (value.idmodule == id_module_param) {
                          value_result[y] = value;
                        }
                        y++;
                      });
                      value_result.push(menu_single);
                      var value_result_x = value_result.filter(function (l) { return l !== '' });

                      // kirim param ke backend 
                      if (value_result.length != 1) {
                        if (id_module_param == '96') {
                          // HtmlLoad(serverHost +'addons/base/dashboard_module.api?id_module='+id_module_param,'Dashboard');
                          HtmlLoad(serverHost + 'addons/ob/dashboard.api?id_module=' + id_module_param, 'Dashboard');
                        } else {
                          HtmlLoad(serverHost + 'addons/base/dashboard_module.api?id_module=' + id_module_param, 'Dashboard');
                        }

                      }

                      // load detail menu ke fungsi
                      Iterate(value_result_x);

                      // $("#loading").addClass('hide');

                      // $.getScript("./addons/base/dashboard.js?v=4");

                      // Iterate(JSON.parse(msg.data));
                    }
                  }
                },
                error: function (err) {
                  console.log(err);
                }
              });


            } else {
              // window.location.replace("login.jsp");
              $.ajax({
                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                url: serverHost + "logout.api",
                method: "GET",
                success: function (result) {
                  sessionStorage.clear();
                  location.replace('./login.jsp');
                },
                error: function (err) {
                  console.log(err);
                }
              });
            }

          },
          error: function (err) {
            console.log(err);
          }
        });


      }

      // menus
      $("#sidebarmenu").click(function (e) {
        $(document).ready(function () {
          $("li.treeview.menu-open > ul.treeview-menu").css({ "background-color": "#fff", "display": "block", "height": "inherit" });
        });
      });

    </script>
    <!-- <script src="./addons/base/dashboard.js?v=3"></script>	 -->

  </body>

  </html>