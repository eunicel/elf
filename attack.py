import mysql.connector
import urllib2
import datetime

wl = open('/usr/share/dict/words', 'r')
wordlist = wl.readlines()
wl.close()

def get_redirected_url(url):
    try:
    	opener = urllib2.build_opener(urllib2.HTTPRedirectHandler)
    	request = opener.open(url)
    	return request.url
    except urllib2.HTTPError, e:
	print e

# set up a database to store the redirect urls
url_data = mysql.connector.connect(host='localhost',
        user='root',
        password='',
        db='urls') # The name of the database we are using is ekgdata.

cursor = url_data.cursor()

#drop_stmt = ( 
#        'DROP TABLE IF EXISTS urls'
#)
#cursor.execute(drop_stmt)

create_stmt = ( 
        'CREATE TABLE IF NOT EXISTS urls'
        ' (WORD CHAR(30), REDIRECT_URL CHAR(100), TIMESTAMP CHAR(30))'
)
cursor.execute(create_stmt)
insert_stmt = 'INSERT IGNORE INTO urls (WORD, REDIRECT_URL, TIMESTAMP) VALUES (%s, %s, %s)'


starttime = datetime.datetime.now()
num_redirected = 0
for word in wordlist:
	word = word[0:len(word)-1] # strips off newline at the end
	original_url = "http://shoutkey.com/" + word
	redirected_url = get_redirected_url(original_url)
	if redirected_url == original_url:
		# did not redirect
		print word, " did not redirect"
		cursor.execute(insert_stmt, (word, None, datetime.datetime.now()))
		url_data.commit()
	else:
		# redirected
		print word, " redirected to ", redirected_url
		num_redirected += 1
		cursor.execute(insert_stmt, (word, redirected_url, datetime.datetime.now()))
		url_data.commit()

totaltime = datetime.datetime.now() - starttime
print totaltime
print "TOTAL NUMBER OF WORDS = ", len(wordlist)
print "NUMBER OF REDIRECTS = ", num_redirected
url_data.close()
		
